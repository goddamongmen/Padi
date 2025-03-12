use cw20::Denom;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
pub struct Config {
    pub admin: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Rally {
    pub id: u64,
    pub creator: Addr,
    pub title: String,
    pub description: String,
    pub goal: Uint128,
    pub deadline: u64,
    pub raised: Uint128,
    pub token_denom: Denom,
    pub is_active: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Feedback {
    pub rally_id: u64,
    pub sender: String,
    pub message: String,
    pub timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Contribution {
    pub amount: Uint128,
    pub token_denom: Denom,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Contributor {
    pub address: String,
    pub contributions: Vec<Contribution>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct TopContributor {
    pub address: String,
    pub contributions: Vec<Contribution>,
    pub contribution_count: u64,
}

// Storage
pub const CONFIG: Item<Config> = Item::new("config");
pub const RALLIES: Map<u64, Rally> = Map::new("rallies");
pub const RALLY_COUNT: Item<u64> = Item::new("rally_count");
pub const FEEDBACKS: Map<(u64, u64), Feedback> = Map::new("feedbacks");
pub const FEEDBACK_COUNT: Map<u64, u64> = Map::new("feedback_count");
pub const CONTRIBUTORS: Map<(u64, &str), Vec<Contribution>> = Map::new("contributors"); // (rally_id, address) -> contributions
pub const TOP_CONTRIBUTORS: Map<&str, (Vec<Contribution>, u64)> = Map::new("top_contributors"); // address -> (contributions, count)
