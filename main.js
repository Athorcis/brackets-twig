/**
 *  Copyright 2016 Athorcis
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/* global brackets */

(function (factory) {
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = factory(require("./src/TwigMixedMode"));
    } else if (typeof define === "function" && define.amd) {
        define(["./src/TwigMixedMode"], factory);
    } else {
        factory(global.TwigMixedMode);
    }
}(function (TwigMixedMode) {
    "use strict";

    if (typeof brackets === "object") {
        var codeMirrorRoot = "thirdparty/CodeMirror",
            CodeMirror = brackets.getModule(codeMirrorRoot + "/lib/codemirror"),
            LanguageManager = brackets.getModule("language/LanguageManager");

        // we define the mode and the language without waiting for htmlmixed and
        // twig to be loaded this create a race condition but if we wait then
        // all the file extensions for which twigmixed is define as default
        // language will see their default language switch to plain text
        TwigMixedMode.define(CodeMirror, codeMirrorRoot);

        LanguageManager.defineLanguage("twigmixed", {
            name: "Twig",
            mode: "twigmixed",
            fileExtensions: ["html.twig", "twig.html", ".twig"]
        })
        .done(function (twig) {
            twig._setLanguageForMode("twig:inner", twig);
        });
    }

    return TwigMixedMode;
}));
