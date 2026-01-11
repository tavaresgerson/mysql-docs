### 15.6.7 Condition Handling

15.6.7.1 DECLARE ... CONDITION Statement

15.6.7.2 DECLARE ... HANDLER Statement

15.6.7.3 GET DIAGNOSTICS Statement

15.6.7.4 RESIGNAL Statement

15.6.7.5 SIGNAL Statement

15.6.7.6 Scope Rules for Handlers

15.6.7.7 The MySQL Diagnostics Area

15.6.7.8 Condition Handling and OUT or INOUT Parameters

Conditions may arise during stored program execution that require special handling, such as exiting the current program block or continuing execution. Handlers can be defined for general conditions such as warnings or exceptions, or for specific conditions such as a particular error code. Specific conditions can be assigned names and referred to that way in handlers.

To name a condition, use the `DECLARE ... CONDITION` statement. To declare a handler, use the `DECLARE ... HANDLER` statement. See Section 15.6.7.1, “DECLARE ... CONDITION Statement”, and Section 15.6.7.2, “DECLARE ... HANDLER Statement”. For information about how the server chooses handlers when a condition occurs, see Section 15.6.7.6, “Scope Rules for Handlers”.

To raise a condition, use the `SIGNAL` statement. To modify condition information within a condition handler, use `RESIGNAL`. See Section 15.6.7.1, “DECLARE ... CONDITION Statement”, and Section 15.6.7.2, “DECLARE ... HANDLER Statement”.

To retrieve information from the diagnostics area, use the `GET DIAGNOSTICS` statement (see Section 15.6.7.3, “GET DIAGNOSTICS Statement”). For information about the diagnostics area, see Section 15.6.7.7, “The MySQL Diagnostics Area”.
