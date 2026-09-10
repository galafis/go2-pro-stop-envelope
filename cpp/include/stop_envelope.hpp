#pragma once

#include <cmath>
#include <stdexcept>

namespace go2 {

// Pure offline model. Units: m, s, m/s, m/s². No hardware interfaces.
// Modelo offline puro. Unidades: m, s, m/s, m/s². Sem interfaces de hardware.
struct Input {
    double speed_mps;
    double reaction_ms;
    double reaction_uncertainty_ms;
    double deceleration_mps2;
    double deceleration_uncertainty_pct;
    double margin_m;
    double available_m;
};

struct Result {
    double nominal_m;
    double upper_m;
    double remaining_m;
    double model_speed_mps;
    double reaction_m;
    double braking_m;
    double margin_m;
    bool within_supplied_distance;
};

inline void require_range(double value, double minimum, double maximum) {
    if (!std::isfinite(value) || value < minimum || value > maximum) {
        throw std::invalid_argument("Value outside model contract / Valor fora do contrato");
    }
}

inline double distance(double speed, double reaction_s, double deceleration, double margin) {
    return speed * reaction_s + speed * speed / (2 * deceleration) + margin;
}

inline Result analyze(const Input& input) {
    require_range(input.speed_mps, 0, 10);
    require_range(input.reaction_ms, 0, 10000);
    require_range(input.reaction_uncertainty_ms, 0, 10000);
    require_range(input.deceleration_mps2, 0.01, 20);
    require_range(input.deceleration_uncertainty_pct, 0, 95);
    require_range(input.margin_m, 0, 20);
    require_range(input.available_m, 0, 1000);

    const double reaction = (input.reaction_ms + input.reaction_uncertainty_ms) / 1000;
    const double deceleration = input.deceleration_mps2 * (1 - input.deceleration_uncertainty_pct / 100);
    const double nominal = distance(input.speed_mps, input.reaction_ms / 1000,
                                    input.deceleration_mps2, input.margin_m);
    const double upper = distance(input.speed_mps, reaction, deceleration, input.margin_m);
    const double usable = input.available_m - input.margin_m;
    const double ar = deceleration * reaction;
    // Rationalized positive root avoids cancellation when usable distance is small.
    // A raiz positiva racionalizada evita cancelamento para distâncias pequenas.
    const double bound = usable <= 0 ? 0 :
        (2 * deceleration * usable) / (std::sqrt(ar * ar + 2 * deceleration * usable) + ar);
    return {nominal, upper, input.available_m - upper, bound, input.speed_mps * reaction,
            input.speed_mps * input.speed_mps / (2 * deceleration), input.margin_m,
            input.available_m >= upper};
}

}  // namespace go2
