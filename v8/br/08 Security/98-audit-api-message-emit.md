### 8.4.6 O Componente de Mensagem de Auditoria

O componente `audit_api_message_emit` permite que as aplicações adicionem seus próprios eventos de mensagem ao log de auditoria, usando a função `audit_api_message_emit_udf()`.

O componente `audit_api_message_emit` coopera com todos os plugins do tipo auditoria. Para maior clareza, os exemplos usam o plugin `audit_log` descrito na Seção 8.4.5, “Auditoria do MySQL Enterprise”.

*  Instalando ou Desinstalando o Componente de Mensagem de Auditoria
*  Função de Mensagem de Auditoria

#### Instalando ou Desinstalando o Componente de Mensagem de Auditoria

Para ser usado pelo servidor, o arquivo da biblioteca do componente deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` na inicialização do servidor.

Para instalar o componente `audit_api_message_emit`, use a seguinte instrução:

```
INSTALL COMPONENT "file://component_audit_api_message_emit";
```

A instalação do componente é uma operação única que não precisa ser feita a cada inicialização do servidor. `INSTALL COMPONENT` carrega o componente e também o registra na tabela do sistema `mysql.component` para que ele seja carregado durante as inicializações subsequentes do servidor.

Para desinstalar o componente `audit_api_message_emit`, use a seguinte instrução:

```
UNINSTALL COMPONENT "file://component_audit_api_message_emit";
```

`UNINSTALL COMPONENT` desliga o componente e o desregistra da tabela do sistema `mysql.component` para que ele não seja carregado durante as inicializações subsequentes do servidor.

Como a instalação e a desinstalação do componente `audit_api_message_emit` instalam e desinstalam a função `audit_api_message_emit_udf()` que o componente implementa, não é necessário usar `CREATE FUNCTION` ou `DROP FUNCTION` para fazer isso.

#### Função de Mensagem de Auditoria

Esta seção descreve a função `audit_api_message_emit_udf()` implementada pelo componente `audit_api_message_emit`.

Antes de usar a função de mensagem de auditoria, instale o componente de mensagem de auditoria de acordo com as instruções fornecidas em Instalando ou Desinstalando o Componente de Mensagem de Auditoria.

* `audit_api_message_emit_udf(componente, produtor, mensagem[, chave, valor] ...)`

  Adota um evento de mensagem ao log de auditoria. Os eventos de mensagem incluem strings de componente, produtor e mensagem do remetente, e opcionalmente um conjunto de pares chave-valor.

  Um evento publicado por esta função é enviado para todos os plugins habilitados do tipo auditoria, cada um dos quais trata o evento de acordo com suas próprias regras. Se nenhum plugin do tipo auditoria estiver habilitado, a publicação do evento não tem efeito.

  Argumentos:

  + *`componente`*: Uma string que especifica um nome de componente.
  + *`produtor`*: Uma string que especifica um nome de produtor.
  + *`mensagem`*: Uma string que especifica a mensagem do evento.
  + *`chave`*, *`valor`*: Eventos podem incluir 0 ou mais pares chave-valor que especificam um mapa de dados fornecido pelo aplicativo arbitrário. Cada argumento *`chave`* é uma string que especifica um nome para o argumento *`valor`* imediatamente após ele. Cada argumento *`valor`* especifica um valor para o argumento *`chave`* imediatamente após ele. Cada *`valor`* pode ser uma string ou um valor numérico, ou `NULL`.

  Valor de retorno:

  A string `OK` para indicar sucesso. Um erro ocorre se a função falhar.

  Exemplo:

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

  Informações adicionais:

  Cada plugin de auditoria que recebe um evento publicado por `audit_api_message_emit_udf()` registra o evento no formato específico do plugin. Por exemplo, o plugin `audit_log` (consulte a Seção 8.4.5, “Auditoria do MySQL Enterprise”) registra os valores da mensagem da seguinte forma, dependendo do formato de log configurado pela variável de sistema `audit_log_format`:

  + Formato JSON ( `audit_log_format=JSON` ):

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
  + Formato XML de novo estilo ( `audit_log_format=NEW` ):

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
  + Formato XML antigo ( `audit_log_format=OLD` ):

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

    ::: info Nota

    Eventos de mensagem registrados no formato XML antigo não incluem o mapa de dados chave-valor devido a restrições de representação impostas por este formato.

As mensagens publicadas pela `audit_api_message_emit_udf()` têm uma classe de evento de `MYSQL_AUDIT_MESSAGE_CLASS` e uma subclasse de `MYSQL_AUDIT_MESSAGE_USER`. (As mensagens de auditoria geradas internamente têm a mesma classe e uma subclasse de `MYSQL_AUDIT_MESSAGE_INTERNAL`; essa subclasse atualmente não é usada.) Para referenciar esses eventos no filtro do `audit_log`, use um elemento `class` com um valor `name` de `message`. Por exemplo:

  ```
  {
    "filter": {
      "class": {
        "name": "message"
      }
    }
  }
  ```

  Se for necessário distinguir entre eventos de mensagens geradas pelo usuário e geradas internamente, teste o valor `subclass` contra `user` ou `internal`.

  O filtro baseado no conteúdo do mapa de chaves e valores não é suportado.

  Para obter informações sobre como escrever regras de filtro, consulte a Seção 8.4.5.7, “Filtro do Log de Auditoria”.