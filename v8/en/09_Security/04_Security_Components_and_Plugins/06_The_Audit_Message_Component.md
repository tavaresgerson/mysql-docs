### 8.4.6 The Audit Message Component

As of MySQL 8.0.14, the `audit_api_message_emit` component enables applications to add their own message events to the audit log, using the `audit_api_message_emit_udf()` function.

The `audit_api_message_emit` component cooperates with all plugins of audit type. For concreteness, examples use the `audit_log` plugin described in Section 8.4.5, “MySQL Enterprise Audit”.

* Installing or Uninstalling the Audit Message Component
* Audit Message Function

#### Installing or Uninstalling the Audit Message Component

To be usable by the server, the component library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

To install the `audit_api_message_emit` component, use this statement:

```
INSTALL COMPONENT "file://component_audit_api_message_emit";
```

Component installation is a one-time operation that need not be done per server startup. `INSTALL COMPONENT` loads the component, and also registers it in the `mysql.component` system table to cause it to be loaded during subsequent server startups.

To uninstall the `audit_api_message_emit` component, use this statement:

```
UNINSTALL COMPONENT "file://component_audit_api_message_emit";
```

`UNINSTALL COMPONENT` unloads the component, and unregisters it from the `mysql.component` system table to cause it not to be loaded during subsequent server startups.

Because installing and uninstalling the `audit_api_message_emit` component installs and uninstalls the `audit_api_message_emit_udf()` function that the component implements, it is not necessary to use `CREATE FUNCTION` or `DROP FUNCTION` to do so.

#### Audit Message Function

This section describes the `audit_api_message_emit_udf()` function implemented by the `audit_api_message_emit` component.

Before using the audit message function, install the audit message component according to the instructions provided at Installing or Uninstalling the Audit Message Component.

* `audit_api_message_emit_udf(component, producer, message[, key, value] ...)`

  Adds a message event to the audit log. Message events include component, producer, and message strings of the caller's choosing, and optionally a set of key-value pairs.

  An event posted by this function is sent to all enabled plugins of audit type, each of which handles the event according to its own rules. If no plugin of audit type is enabled, posting the event has no effect.

  Arguments:

  + *`component`*: A string that specifies a component name.

  + *`producer`*: A string that specifies a producer name.

  + *`message`*: A string that specifies the event message.

  + *`key`*, *`value`*: Events may include 0 or more key-value pairs that specify an arbitrary application-provided data map. Each *`key`* argument is a string that specifies a name for its immediately following *`value`* argument. Each *`value`* argument specifies a value for its immediately following *`key`* argument. Each *`value`* can be a string or numeric value, or `NULL`.

  Return value:

  The string `OK` to indicate success. An error occurs if the function fails.

  Example:

  ```
  mysql> SELECT audit_api_message_emit_udf('component_text',
                                           'producer_text',
                                           'message_text',
                                           'key1', 'value1',
                                           'key2', 123,
                                           'key3', NULL) AS 'Message';
  +---------+
  | Message |
  +---------+
  | OK      |
  +---------+
  ```

  Additional information:

  Each audit plugin that receives an event posted by `audit_api_message_emit_udf()` logs the event in plugin-specific format. For example, the `audit_log` plugin (see Section 8.4.5, “MySQL Enterprise Audit”) logs message values as follows, depending on the log format configured by the `audit_log_format` system variable:

  + JSON format (`audit_log_format=JSON`):

    ```
    {
      ...
      "class": "message",
      "event": "user",
      ...
      "message_data": {
        "component": "component_text",
        "producer": "producer_text",
        "message": "message_text",
        "map": {
          "key1": "value1",
          "key2": 123,
          "key3": null
        }
      }
    }
    ```

  + New-style XML format (`audit_log_format=NEW`):

    ```
    <AUDIT_RECORD>
     ...
     <NAME>Message</NAME>
     ...
     <COMMAND_CLASS>user</COMMAND_CLASS>
     <COMPONENT>component_text</COMPONENT>
     <PRODUCER>producer_text</PRODUCER>
     <MESSAGE>message_text</MESSAGE>
     <MAP>
       <ELEMENT>
         <KEY>key1</KEY>
         <VALUE>value1</VALUE>
       </ELEMENT>
       <ELEMENT>
         <KEY>key2</KEY>
         <VALUE>123</VALUE>
       </ELEMENT>
       <ELEMENT>
         <KEY>key3</KEY>
         <VALUE/>
       </ELEMENT>
     </MAP>
    </AUDIT_RECORD>
    ```

  + Old-style XML format (`audit_log_format=OLD`):

    ```
    <AUDIT_RECORD
      ...
      NAME="Message"
      ...
      COMMAND_CLASS="user"
      COMPONENT="component_text"
      PRODUCER="producer_text"
      MESSAGE="message_text"/>
    ```

    Note

    Message events logged in old-style XML format do not include the key-value map due to representational constraints imposed by this format.

  Messages posted by `audit_api_message_emit_udf()` have an event class of `MYSQL_AUDIT_MESSAGE_CLASS` and a subclass of `MYSQL_AUDIT_MESSAGE_USER`. (Internally generated audit messages have the same class and a subclass of `MYSQL_AUDIT_MESSAGE_INTERNAL`; this subclass currently is unused.) To refer to such events in `audit_log` filtering rules, use a `class` element with a `name` value of `message`. For example:

  ```
  {
    "filter": {
      "class": {
        "name": "message"
      }
    }
  }
  ```

  Should it be necessary to distinguish user-generated and internally generated message events, test the `subclass` value against `user` or `internal`.

  Filtering based on the contents of the key-value map is not supported.

  For information about writing filtering rules, see Section 8.4.5.7, “Audit Log Filtering”.
