## 23.3 Usando Triggers

23.3.1 Sintaxe e Exemplos de Trigger

23.3.2 Metadados de Trigger

Um trigger é um objeto de database nomeado que está associado a uma table e que é ativado quando um determinado *event* ocorre na table. Alguns usos para *triggers* incluem a realização de verificações de valores a serem *inserted* em uma table ou a execução de cálculos em valores envolvidos em um *update*.

Um *trigger* é definido para ser ativado quando um *statement* *inserts*, *updates* ou *deletes* *rows* na *table* associada. Essas operações de *row* são *trigger events*. Por exemplo, *rows* podem ser *inserted* por *statements* `INSERT` ou `LOAD DATA`, e um *insert trigger* é ativado para cada *row* *inserted*. Um *trigger* pode ser configurado para ser ativado *before* (antes) ou *after* (depois) do *trigger event*. Por exemplo, você pode ter um *trigger* ativado *before* cada *row* que é *inserted* em uma *table* ou *after* cada *row* que é *updated*.

Importante

Triggers do MySQL ativam apenas para alterações feitas em tables por meio de SQL statements. Isso inclui alterações em base tables que sustentam views atualizáveis. Triggers não ativam para alterações em tables feitas por APIs que não transmitem SQL statements para o MySQL Server. Isso significa que triggers não são ativados por updates feitos usando a `NDB` API.

Triggers não são ativados por alterações nas tables `INFORMATION_SCHEMA` ou `performance_schema`. Essas tables são, na verdade, views, e triggers não são permitidos em views.

As seções a seguir descrevem a *syntax* para criar e remover *triggers*, mostram alguns exemplos de como usá-los e indicam como obter *trigger metadata*.

### Recursos Adicionais

* Você pode achar o [MySQL User Forums](https://forums.mysql.com/list.php?20) útil ao trabalhar com triggers.

* Para respostas a perguntas frequentes sobre triggers no MySQL, consulte a Seção A.5, “MySQL 5.7 FAQ: Triggers”.

* Existem algumas restrições sobre o uso de triggers; consulte a Seção 23.8, “Restrições em Stored Programs”.

* O Binary logging para triggers ocorre conforme descrito na Seção 23.7, “Stored Program Binary Logging”.