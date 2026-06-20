### 15.6.7 Condition Handling

Conditions may arise during stored program execution that require special handling, such as exiting the current program block or continuing execution. Handlers can be defined for general conditions such as warnings or exceptions, or for specific conditions such as a particular error code. Specific conditions can be assigned names and referred to that way in handlers.

To name a condition, use the [`DECLARE ... CONDITION`](declare-condition.html "15.6.7.1 DECLARE ... CONDITION Statement") statement. To declare a handler, use the [`DECLARE ... HANDLER`](declare-handler.html "15.6.7.2 DECLARE ... HANDLER Statement") statement. See Section 15.6.7.1, “DECLARE ... CONDITION Statement”, and Section 15.6.7.2, “DECLARE ... HANDLER Statement”. For information about how the server chooses handlers when a condition occurs, see Section 15.6.7.6, “Scope Rules for Handlers”.

To raise a condition, use the `SIGNAL` statement. To modify condition information within a condition handler, use `RESIGNAL`. See Section 15.6.7.1, “DECLARE ... CONDITION Statement”, and Section 15.6.7.2, “DECLARE ... HANDLER Statement”.

To retrieve information from the diagnostics area, use the `GET DIAGNOSTICS` statement (see Section 15.6.7.3, “GET DIAGNOSTICS Statement”). For information about the diagnostics area, see Section 15.6.7.7, “The MySQL Diagnostics Area”.