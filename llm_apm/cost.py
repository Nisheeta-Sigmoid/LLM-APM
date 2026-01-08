def calculate_cost(
    prompt_tokens: int,
    completion_tokens: int,
    model: str = "default"
) -> float:

    PRICING = {
        "default": {
            "prompt": 0.000001,
            "completion": 0.000002
        }
    }

    pricing = PRICING.get(model, PRICING["default"])

    cost = (
        prompt_tokens * pricing["prompt"]
        + completion_tokens * pricing["completion"]
    )

    return round(cost, 6)
