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

(function (global, factory) {
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = factory(require("./TwigMixedContext"));
    } else if (typeof define === "function" && define.amd) {
        define(["./TwigMixedContext"], factory);
    } else {
        global.TwigMixedState = factory(global.TwigMixedContext);
    }
}(this, function (TwigMixedContext) {
    "use strict";

    /**
     *  An object which represent the state of the parser
     *  @class
     *
     *  @param {Object}         CodeMirror      the current instance of CodeMirror
     *  @param {TwigMixedMode}  twigMixedMode   the instance of the twigmixed mode
     */
    function TwigMixedState(CodeMirror, twigMixedMode) {
        this._htmlMixedMode = twigMixedMode.htmlMixedMode;
        this._twigMode = twigMixedMode.twigMode;

        this.htmlMixedState = CodeMirror.startState(this._htmlMixedMode);
        this.twigState = CodeMirror.startState(this._twigMode);

        this.currentMode = this._htmlMixedMode;
        this.currentState = this.htmlMixedState;

        this.conditionnalStrings = [];
    }

    TwigMixedState.prototype = {
        indented: 0,

        tagName: "",

        tagStart: 0,

        context: null,

        _htmlMixedMode: null,

        _twigMode: null,

        htmlMixedState: null,

        twigState: null,

        currentMode: null,

        currentState: null,

        pendingToken: null,

        pendingString: "",

        previousPendingString: "",

        conditionnalStrings: null,

        twigTagOpened: false,

        /**
         *  Returns true if we are in twig mode false otherwise
         *
         *  @returns {boolean} true if we are in twig mode
         */
        inTwigMode: function () {
            return this.currentMode === this._twigMode;
        },

        /**
         *  Clone the current context
         *
         *  @param {Object} CodeMirror the current instance of CodeMirror
         *
         *  @returns {TwigMixedContext} the cloned context
         */
        clone: function (CodeMirror) {
            var htmlMixedState = CodeMirror.copyState(this._htmlMixedMode, this.htmlMixedState),
                twigState = CodeMirror.copyState(this._twigMode, this.twigState),
                state = Object.create(TwigMixedState.prototype);

            state.indented = this.indented;

            state.tagName = this.tagName;
            state.tagStart = this.tagStart;

            state.context = this.context ? this.context.clone() : null;

            state._htmlMixedMode = this._htmlMixedMode;
            state._twigMode = this._twigMode;

            state.htmlMixedState = htmlMixedState;
            state.twigState = twigState;

            state.currentMode = this.currentMode;
            state.currentState = this.inTwigMode() ? twigState : htmlMixedState;

            state.pendingToken = this.pendingToken;

            state.pendingString = this.pendingString;
            state.previousPendingString = this.previousPendingString;
            state.conditionnalStrings = this.conditionnalStrings.slice(0);

            state.twigTagOpened = this.twigTagOpened;

            return state;
        },

        /**
         *  Return the current inner mode and its state
         *
         *  @returns {Object} the inner mode and its state
         */
        getInnerMode: function () {
            return {
                mode: this.currentMode,

                state: this.currentState
            };
        },

        /**
         *  Return current htmlmixed context
         *
         *  @returns {Object} the html context
         */
        getHtmlContext: function () {
            return this.htmlMixedState.htmlState.context;
        },

        /**
         *  Push a new context to the stack
         *
         *  @returns {undefined}
         */
        pushContext: function () {
            var tagName = this.tagName,
                tagStart = this.tagStart;

            this.tagName = this.tagStart = null;
            this.context = new TwigMixedContext(this, tagName, tagStart === this.indented);
        },

        /**
         *  Return the tag name in the current context
         *
         *  @returns {string} tag name of the current context
         */
        getContextualTagName: function () {
            if (this.context) {
                return this.context.tagName;
            }

            return "";
        },

        /**
         *  Return true if we can pop context out for a given tagname, false otherwise
         *
         *  @param {string} tagName the tag name to match
         *
         *  @returns {boolean} true if we can pop context out
         */
        canPopContext: function (tagName) {
            return "end" + this.getContextualTagName() === tagName;
        },

        /**
         *  Pop a context object out of the stack
         *
         *  @returns {undefined}
         */
        popContext: function () {
            this.context = this.context.previous;
        }
    };

    return TwigMixedState;
}));
