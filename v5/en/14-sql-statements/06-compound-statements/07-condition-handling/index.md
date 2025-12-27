### 13.6.7 Condition Handling

[13.6.7.1 DECLARE ... CONDITION Statement](declare-condition.html)

[13.6.7.2 DECLARE ... HANDLER Statement](declare-handler.html)

[13.6.7.3 GET DIAGNOSTICS Statement](get-diagnostics.html)

[13.6.7.4 RESIGNAL Statement](resignal.html)

[13.6.7.5 SIGNAL Statement](signal.html)

[13.6.7.6 Scope Rules for Handlers](handler-scope.html)

[13.6.7.7 The MySQL Diagnostics Area](diagnostics-area.html)

[13.6.7.8 Condition Handling and OUT or INOUT Parameters](conditions-and-parameters.html)

[13.6.7.9 Restrictions on Condition Handling](condition-handling-restrictions.html)

Conditions may arise during stored program execution that require special handling, such as exiting the current program block or continuing execution. Handlers can be defined for general conditions such as warnings or exceptions, or for specific conditions such as a particular error code. Specific conditions can be assigned names and referred to that way in handlers.

To name a condition, use the [`DECLARE ... CONDITION`](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement") statement. To declare a handler, use the [`DECLARE ... HANDLER`](declare-handler.html "13.6.7.2 DECLARE ... HANDLER Statement") statement. See [Section 13.6.7.1, “DECLARE ... CONDITION Statement”](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement"), and [Section 13.6.7.2, “DECLARE ... HANDLER Statement”](declare-handler.html "13.6.7.2 DECLARE ... HANDLER Statement"). For information about how the server chooses handlers when a condition occurs, see [Section 13.6.7.6, “Scope Rules for Handlers”](handler-scope.html "13.6.7.6 Scope Rules for Handlers").

To raise a condition, use the [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement. To modify condition information within a condition handler, use [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement"). See [Section 13.6.7.1, “DECLARE ... CONDITION Statement”](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement"), and [Section 13.6.7.2, “DECLARE ... HANDLER Statement”](declare-handler.html "13.6.7.2 DECLARE ... HANDLER Statement").

To retrieve information from the diagnostics area, use the [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") statement (see [Section 13.6.7.3, “GET DIAGNOSTICS Statement”](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement")). For information about the diagnostics area, see [Section 13.6.7.7, “The MySQL Diagnostics Area”](diagnostics-area.html "13.6.7.7 The MySQL Diagnostics Area").
