use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint128};
use cw20::Denom;

use crate::state::{Config, Contributor, Feedback, Rally, TopContributor};

#[cw_serde]
pub struct InstantiateMsg {}

#[cw_serde]
pub enum ExecuteMsg {
    CreateRally {
        title: String,
        description: String,
        goal: Uint128,
        deadline: u64,
        token_denom: Denom,
    },
    FundRally {
        rally_id: u64,
        amount: Uint128,
    },
    WithdrawFunds {
        rally_id: u64,
    },
    AddFeedback {
        rally_id: u64,
        message: String,
    },
    CloseRally {
        rally_id: u64,
    },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(GetConfigResponse)]
    GetConfig {},

    #[returns(GetRallyResponse)]
    GetRally { rally_id: u64 },

    #[returns(GetFeedbackResponse)]
    GetFeedback { rally_id: u64, feedback_id: u64 },

    #[returns(GetListRalliesResponse)]
    ListRallies {
        start_after: Option<u64>,
        limit: Option<u32>,
    },

    #[returns(GetContributorResponse)]
    GetContributor { rally_id: u64, contributor: Addr },

    #[returns(GetTopContributorsResponse)]
    GetTopContributors { limit: Option<u32> },
}

// We define a custom struct for each query response
#[cw_serde]
pub struct GetConfigResponse {
    pub config: Config,
}

#[cw_serde]
pub struct GetRallyResponse {
    pub rally: Rally,
}

#[cw_serde]
pub struct GetFeedbackResponse {
    pub feedback: Feedback,
}

#[cw_serde]
pub struct GetListRalliesResponse {
    pub rallies: Vec<Rally>,
}

#[cw_serde]
pub struct GetContributorResponse {
    pub contributor: Contributor,
}

#[cw_serde]
pub struct GetTopContributorsResponse {
    pub contributors: Vec<TopContributor>,
}
