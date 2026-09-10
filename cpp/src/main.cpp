#include "stop_envelope.hpp"

#include <array>
#include <iomanip>
#include <iostream>
#include <locale>
#include <regex>
#include <string>

double parse_number(const std::string& text) {
    static const std::regex decimal(R"([+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?)");
    if (!std::regex_match(text, decimal)) {
        throw std::invalid_argument("Expected decimal number / Esperado número decimal");
    }
    std::size_t consumed = 0;
    const double value = std::stod(text, &consumed);
    if (consumed != text.size() || !std::isfinite(value)) {
        throw std::invalid_argument("Invalid number / Número inválido");
    }
    return value;
}

int main(int argc, char* argv[]) {
    std::cout.imbue(std::locale::classic());
    std::cout << std::setprecision(17);
    const bool curve = argc == 9 && std::string(argv[1]) == "--curve";
    if (argc != 8 && !curve) {
        std::cerr << "Usage / Uso: stop-envelope [--curve] speed_mps reaction_ms reaction_uncertainty_ms "
                     "deceleration_mps2 deceleration_uncertainty_pct margin_m available_m\n";
        return 1;
    }
    try {
        std::array<double, 7> values{};
        for (std::size_t index = 0; index < values.size(); ++index) {
            values[index] = parse_number(argv[index + (curve ? 2 : 1)]);
        }
        go2::Input input{values[0], values[1], values[2], values[3], values[4], values[5], values[6]};
        const auto result = go2::analyze(input);
        if (curve) {
            std::cout << "speedMps,nominalM,upperM,remainingM\n";
            for (int index = 0; index <= 40; ++index) {
                input.speed_mps = static_cast<double>(index) / 4;
                const auto row = go2::analyze(input);
                std::cout << input.speed_mps << ',' << row.nominal_m << ',' << row.upper_m
                          << ',' << row.remaining_m << '\n';
            }
            return 0;
        }
        std::cout << "{\"nominalM\":" << result.nominal_m << ",\"upperM\":" << result.upper_m
                  << ",\"remainingM\":" << result.remaining_m << ",\"modelSpeedMps\":" << result.model_speed_mps
                  << ",\"components\":{\"reactionM\":" << result.reaction_m << ",\"brakingM\":" << result.braking_m
                  << ",\"marginM\":" << result.margin_m << "},\"withinSuppliedDistance\":"
                  << (result.within_supplied_distance ? "true" : "false") << "}\n";
        return result.within_supplied_distance ? 0 : 2;
    } catch (const std::exception&) {
        std::cerr << "Invalid input: review units and ranges / Entrada inválida: revise unidades e limites\n";
        return 1;
    }
}
