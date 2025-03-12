#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;
use execute::{
    execute_add_feedback, execute_close_rally, execute_create_rally, execute_fund_rally,
    execute_withdraw_funds,
};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{Config, CONFIG};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:padi-contract";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let state = Config {
        admin: info.sender.clone(),
    };
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    CONFIG.save(deps.storage, &state)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreateRally {
            title,
            description,
            goal,
            deadline,
            token_denom,
        } => execute_create_rally(
            deps,
            env,
            info,
            title,
            description,
            goal,
            deadline,
            token_denom,
        ),
        ExecuteMsg::FundRally { rally_id, amount } => {
            execute_fund_rally(deps, env, info, rally_id, amount)
        }
        ExecuteMsg::WithdrawFunds { rally_id } => execute_withdraw_funds(deps, env, info, rally_id),
        ExecuteMsg::AddFeedback { rally_id, message } => {
            execute_add_feedback(deps, env, info, rally_id, message)
        }
        ExecuteMsg::CloseRally { rally_id } => execute_close_rally(deps, env, info, rally_id),
    }
}

pub mod execute {
    use cosmwasm_std::{BankMsg, Coin, CosmosMsg, StdError, Uint128, WasmMsg};
    use cw20::{Cw20ExecuteMsg, Denom};

    use crate::state::{
        Contribution, Feedback, Rally, CONTRIBUTORS, FEEDBACKS, FEEDBACK_COUNT, RALLIES,
        RALLY_COUNT, TOP_CONTRIBUTORS,
    };

    use super::*;

    // Execute functions
    pub fn execute_create_rally(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        title: String,
        description: String,
        goal: Uint128,
        deadline: u64,
        token_denom: Denom,
    ) -> Result<Response, ContractError> {
        if env.block.time.seconds() >= deadline {
            return Err(ContractError::Std(StdError::generic_err(
                "Deadline must be in the future",
            )));
        }
        if goal.is_zero() {
            return Err(ContractError::Std(StdError::generic_err(
                "Goal must be greater than zero",
            )));
        }

        let mut count = RALLY_COUNT.load(deps.storage)?;
        count += 1;

        let rally = Rally {
            id: count,
            creator: info.sender,
            title,
            description,
            goal,
            deadline,
            raised: Uint128::zero(),
            token_denom,
            is_active: true,
        };

        RALLIES.save(deps.storage, count, &rally)?;
        RALLY_COUNT.save(deps.storage, &count)?;

        Ok(Response::new()
            .add_attribute("method", "create_rally")
            .add_attribute("rally_id", count.to_string()))
    }

    pub fn execute_fund_rally(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        rally_id: u64,
        amount: Uint128,
    ) -> Result<Response, ContractError> {
        let mut rally = RALLIES.load(deps.storage, rally_id)?;

        if !rally.is_active {
            return Err(ContractError::Std(StdError::generic_err(
                "Rally is not active",
            )));
        }
        if env.block.time.seconds() > rally.deadline {
            return Err(ContractError::Std(StdError::generic_err(
                "Rally has expired",
            )));
        }
        if amount.is_zero() {
            return Err(ContractError::Std(StdError::generic_err(
                "Amount must be greater than zero",
            )));
        }

        let msg = match rally.token_denom.clone() {
            Denom::Native(denom) => {
                let sent_amount = info
                    .funds
                    .iter()
                    .find(|coin| coin.denom == denom)
                    .map(|coin| coin.amount)
                    .unwrap_or(Uint128::zero());

                if sent_amount != amount {
                    return Err(ContractError::Std(StdError::generic_err(
                        "Sent amount does not match specified amount",
                    )));
                }
                CosmosMsg::Bank(BankMsg::Send {
                    to_address: env.contract.address.to_string(),
                    amount: vec![Coin { denom, amount }],
                })
            }
            Denom::Cw20(ref addr) => CosmosMsg::Wasm(WasmMsg::Execute {
                contract_addr: addr.to_string(),
                msg: to_json_binary(&Cw20ExecuteMsg::TransferFrom {
                    owner: info.sender.to_string(),
                    recipient: env.contract.address.to_string(),
                    amount,
                })?,
                funds: vec![],
            }),
        };

        // Update rally
        rally.raised += amount;
        RALLIES.save(deps.storage, rally_id, &rally)?;

        // Update contributor tracking
        let sender_str = info.sender.to_string();
        let mut contributions = CONTRIBUTORS
            .may_load(deps.storage, (rally_id, &sender_str))?
            .unwrap_or(vec![]);
        let new_contribution = Contribution {
            amount,
            token_denom: rally.token_denom.clone(),
        };
        contributions.push(new_contribution.clone());
        CONTRIBUTORS.save(deps.storage, (rally_id, &sender_str), &contributions)?;

        // Update top contributors
        let (mut total_contributions, count) = TOP_CONTRIBUTORS
            .may_load(deps.storage, &sender_str)?
            .unwrap_or((vec![], 0));
        total_contributions.push(new_contribution);
        TOP_CONTRIBUTORS.save(deps.storage, &sender_str, &(total_contributions, count + 1))?;

        Ok(Response::new()
            .add_message(msg)
            .add_attribute("method", "fund_rally")
            .add_attribute("rally_id", rally_id.to_string())
            .add_attribute("amount", amount.to_string())
            .add_attribute("contributor", info.sender.to_string()))
    }

    pub fn execute_withdraw_funds(
        deps: DepsMut,
        _env: Env,
        info: MessageInfo,
        rally_id: u64,
    ) -> Result<Response, ContractError> {
        let mut rally = RALLIES.load(deps.storage, rally_id)?;

        if info.sender != rally.creator {
            return Err(ContractError::Std(StdError::generic_err(
                "Only rally creator can withdraw funds",
            )));
        }
        if rally.raised.is_zero() {
            return Err(ContractError::Std(StdError::generic_err(
                "No funds to withdraw",
            )));
        }

        let amount = rally.raised;
        rally.raised = Uint128::zero();
        RALLIES.save(deps.storage, rally_id, &rally)?;

        let msg = match rally.token_denom.clone() {
            Denom::Native(denom) => CosmosMsg::Bank(BankMsg::Send {
                to_address: rally.creator.to_string(),
                amount: vec![Coin { denom, amount }],
            }),
            Denom::Cw20(addr) => CosmosMsg::Wasm(WasmMsg::Execute {
                contract_addr: addr.to_string(),
                msg: to_json_binary(&Cw20ExecuteMsg::Transfer {
                    recipient: rally.creator.to_string(),
                    amount,
                })?,
                funds: vec![],
            }),
        };

        Ok(Response::new()
            .add_message(msg)
            .add_attribute("method", "withdraw_funds")
            .add_attribute("rally_id", rally_id.to_string())
            .add_attribute("amount", amount.to_string()))
    }

    pub fn execute_add_feedback(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        rally_id: u64,
        message: String,
    ) -> Result<Response, ContractError> {
        let rally = RALLIES.load(deps.storage, rally_id)?;
        if !rally.is_active {
            return Err(ContractError::Std(StdError::generic_err(
                "Rally is not active",
            )));
        }

        let sender_str = info.sender.to_string();
        let contributions = CONTRIBUTORS
            .may_load(deps.storage, (rally_id, &sender_str))?
            .unwrap_or(vec![]);
        if contributions.is_empty() {
            return Err(ContractError::Std(StdError::generic_err(
                "Only contributors can add feedback",
            )));
        }

        let feedback_id = FEEDBACK_COUNT
            .may_load(deps.storage, rally_id)?
            .unwrap_or(0)
            + 1;

        let feedback = Feedback {
            rally_id,
            sender: sender_str,
            message,
            timestamp: env.block.time.seconds(),
        };

        FEEDBACKS.save(deps.storage, (rally_id, feedback_id), &feedback)?;
        FEEDBACK_COUNT.save(deps.storage, rally_id, &feedback_id)?;

        Ok(Response::new()
            .add_attribute("method", "add_feedback")
            .add_attribute("rally_id", rally_id.to_string())
            .add_attribute("feedback_id", feedback_id.to_string()))
    }

    pub fn execute_close_rally(
        deps: DepsMut,
        _env: Env,
        info: MessageInfo,
        rally_id: u64,
    ) -> Result<Response, ContractError> {
        let mut rally = RALLIES.load(deps.storage, rally_id)?;

        if info.sender != rally.creator {
            return Err(ContractError::Unauthorized {});
        }

        rally.is_active = false;
        RALLIES.save(deps.storage, rally_id, &rally)?;

        Ok(Response::new()
            .add_attribute("method", "close_rally")
            .add_attribute("rally_id", rally_id.to_string()))
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetConfig {} => to_json_binary(&query::get_config(deps)?),
        QueryMsg::GetRally { rally_id } => to_json_binary(&query::get_rally(deps, rally_id)?),
        QueryMsg::GetFeedback {
            rally_id,
            feedback_id,
        } => to_json_binary(&query::get_feedback(deps, rally_id, feedback_id)?),
        QueryMsg::ListRallies { start_after, limit } => {
            to_json_binary(&query::list_rallies(deps, start_after, limit)?)
        }
        QueryMsg::GetContributor {
            rally_id,
            contributor,
        } => to_json_binary(&query::get_contributor(deps, rally_id, contributor)?),
        QueryMsg::GetTopContributors { limit } => {
            to_json_binary(&query::get_top_contributors(deps, limit)?)
        }
    }
}

pub mod query {
    use cosmwasm_std::{Addr, Order};
    use cw_storage_plus::Bound;

    use crate::{
        msg::{
            GetConfigResponse, GetContributorResponse, GetFeedbackResponse, GetListRalliesResponse,
            GetRallyResponse, GetTopContributorsResponse,
        },
        state::{
            Contributor, Rally, TopContributor, CONTRIBUTORS, FEEDBACKS, RALLIES, TOP_CONTRIBUTORS,
        },
    };

    use super::*;

    pub fn get_config(deps: Deps) -> StdResult<GetConfigResponse> {
        let config = CONFIG.load(deps.storage)?;
        Ok(GetConfigResponse { config })
    }

    pub fn get_rally(deps: Deps, rally_id: u64) -> StdResult<GetRallyResponse> {
        let rally = RALLIES.load(deps.storage, rally_id)?;
        Ok(GetRallyResponse { rally })
    }

    pub fn get_feedback(
        deps: Deps,
        rally_id: u64,
        feedback_id: u64,
    ) -> StdResult<GetFeedbackResponse> {
        let feedback = FEEDBACKS.load(deps.storage, (rally_id, feedback_id))?;
        Ok(GetFeedbackResponse { feedback })
    }

    pub fn list_rallies(
        deps: Deps,
        start_after: Option<u64>,
        limit: Option<u32>,
    ) -> StdResult<GetListRalliesResponse> {
        let start = start_after.map(Bound::exclusive);
        let limit = limit.unwrap_or(10).min(100) as usize;
        let rallies: Vec<Rally> = RALLIES
            .range(deps.storage, start, None, Order::Ascending)
            .take(limit)
            .map(|item| item.map(|(_, v)| v))
            .collect::<StdResult<Vec<_>>>()?;
        Ok(GetListRalliesResponse { rallies })
    }

    pub fn get_contributor(
        deps: Deps,
        rally_id: u64,
        contributor: Addr,
    ) -> StdResult<GetContributorResponse> {
        let contributions = CONTRIBUTORS
            .may_load(deps.storage, (rally_id, contributor.as_str()))?
            .unwrap_or(vec![]);
        Ok(GetContributorResponse {
            contributor: Contributor {
                address: contributor.to_string(),
                contributions,
            },
        })
    }

    pub fn get_top_contributors(
        deps: Deps,
        limit: Option<u32>,
    ) -> StdResult<GetTopContributorsResponse> {
        let limit = limit.unwrap_or(10).min(10) as usize;
        let contributors: Vec<TopContributor> = TOP_CONTRIBUTORS
            .range(deps.storage, None, None, Order::Descending)
            .take(limit)
            .map(|item| {
                let (addr, (contributions, count)) = item?;
                Ok(TopContributor {
                    address: addr.to_string(),
                    contributions,
                    contribution_count: count,
                })
            })
            .collect::<StdResult<Vec<_>>>()?;
        Ok(GetTopContributorsResponse { contributors })
    }
}
