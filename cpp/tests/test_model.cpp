#include "stop_envelope.hpp"

#include <cstdlib>
#include <iostream>
#include <limits>

void check(bool condition, const char* label) {
    if (!condition) {
        std::cerr << "Failed / Falhou: " << label << '\n';
        std::exit(1);
    }
}

bool near(double left, double right) { return std::abs(left - right) <= 1e-10; }

int main() {
    go2::Input input{1, 200, 100, 2, 20, 0.3, 2};
    auto result = go2::analyze(input);
    check(near(result.nominal_m, 0.75), "known nominal distance");
    check(near(result.upper_m, 0.9125), "known upper distance");
    check(near(result.remaining_m, 1.0875), "distance accounting");
    check(near(result.upper_m, result.reaction_m + result.braking_m + result.margin_m), "component sum");
    check(result.within_supplied_distance, "feasible model");
    check(near(go2::distance(result.model_speed_mps, .3, 1.6, .3), input.available_m), "quadratic inverse");
    input.available_m = result.upper_m;
    check(go2::analyze(input).within_supplied_distance, "exact boundary accepted");
    input.available_m -= 1e-8;
    check(!go2::analyze(input).within_supplied_distance, "deficit before rounding");
    input.speed_mps = 0;
    check(near(go2::analyze(input).upper_m, input.margin_m), "stationary margin retained");
    input.available_m = .1;
    check(go2::analyze(input).model_speed_mps == 0, "no usable distance");
    input = {1, 0, 0, 2, 0, 0, 1};
    check(near(go2::analyze(input).model_speed_mps, 2), "zero reaction inverse");
    double previous = -1;
    for (int i = 0; i <= 40; ++i) {
        input.speed_mps = static_cast<double>(i) / 4;
        result = go2::analyze(input);
        check(result.upper_m >= previous, "distance monotonic in speed");
        previous = result.upper_m;
    }
    for (double invalid : {-1.0, 10.01, std::numeric_limits<double>::infinity(),
                           std::numeric_limits<double>::quiet_NaN()}) {
        input.speed_mps = invalid;
        bool rejected = false;
        try { go2::analyze(input); } catch (const std::invalid_argument&) { rejected = true; }
        check(rejected, "invalid speed rejected");
    }
    input = {1, 0, 0, 0, 0, 0, 1};
    bool rejected = false;
    try { go2::analyze(input); } catch (const std::invalid_argument&) { rejected = true; }
    check(rejected, "zero deceleration rejected");
    std::cout << "C++ model invariants passed / Invariantes do modelo aprovadas\n";
}
