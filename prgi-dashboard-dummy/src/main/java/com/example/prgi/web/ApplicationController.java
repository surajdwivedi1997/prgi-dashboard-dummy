package com.example.prgi.web;

import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        Map<String, Object> out = new LinkedHashMap<>();

        out.put("New Registration", Map.of(
                "New Applications (Response awaited from Specified Authority within 60 days window)", "275",
                "Applications received from Specified Authority with/without comments after 60 days", "42",
                "Deficient – Applications Response awaited from publishers", "2",
                "Under Process at PRGI (Above ASO Level)", "235",
                "Applications Rejected", "24+61 (Partial Reject)",
                "Registration Granted", "270"
        ));

        out.put("New Edition", Map.of(
                "New Applications (Response awaited from Specified Authority within 60 days window)", "68",
                "Applications received from Specified Authority with/without comments after 60 days", "7",
                "Deficient – Applications Response awaited from publishers", "1",
                "Under Process at PRGI (Above ASO Level)", "61",
                "Applications Rejected", "0+2 (Partial Reject)",
                "Registration Granted", "12"
        ));

        out.put("Revised Registration", Map.of(
                "New Applications (Response awaited from Specified Authority within 60 days window)", "50",
                "Applications received from Specified Authority with/without comments after 60 days", "34",
                "Deficient – Applications Response awaited from publishers", "17",
                "Under Process at PRGI (Above ASO Level)", "67",
                "Applications Rejected", "1+14 (Partial Reject)",
                "Registration Granted", "103"
        ));

        out.put("Ownership Transfer", Map.of(
                "New Applications (Response awaited from Specified Authority within 60 days window)", "25",
                "Applications received from Specified Authority with/without comments after 60 days", "5",
                "Deficient – Applications Response awaited from publishers", "13",
                "Under Process at PRGI (Above ASO Level)", "21",
                "Applications Rejected", "0",
                "Registration Granted", "0"
        ));

        out.put("Discontinuation of Publication", Map.of(
                "New Applications (Response awaited from Specified Authority within 60 days window)", "0",
                "Applications received from Specified Authority with/without comments after 60 days", "0",
                "Deficient – Applications Response awaited from publishers", "0",
                "Under Process at PRGI (Above ASO Level)", "3",
                "Applications Rejected", "0",
                "Registration Granted", "0"
        ));

        out.put("Newsprint Declaration Authentication", Map.of(
                "New Applications (Response awaited from Specified Authority within 60 days window)", "0",
                "Applications received from Specified Authority with/without comments after 60 days", "9",
                "Deficient – Applications Response awaited from publishers", "1",
                "Under Process at PRGI (Above ASO Level)", "0",
                "Applications Rejected", "0",
                "Registration Granted", "5"
        ));

        return out;
    }
}