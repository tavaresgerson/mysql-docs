## 26.1 Pré-requisitos para Usar o Schema sys

Antes de usar o schema `sys`, os pré-requisitos descritos nesta seção devem ser satisfeitos.

Como o schema `sys` fornece um meio alternativo de acessar o Performance Schema, o Performance Schema deve estar habilitado para que o schema `sys` funcione. Consulte a Seção 25.3, “Configuração de Inicialização do Performance Schema”.

Para acesso total ao schema `sys`, um usuário deve ter estes privilégios:

* `SELECT` em todas as tabelas e views do `sys`

* `EXECUTE` em todos os procedimentos armazenados e functions do `sys`

* `INSERT` e `UPDATE` para a tabela `sys_config`, caso alterações precisem ser feitas nela

* Privilégios adicionais para certos procedimentos armazenados e functions do schema `sys`, conforme observado em suas descrições (por exemplo, o procedimento `ps_setup_save()`)

Também é necessário ter privilégios para os objetos subjacentes aos objetos do schema `sys`:

* `SELECT` em quaisquer tabelas do Performance Schema acessadas por objetos do schema `sys`, e `UPDATE` para quaisquer tabelas a serem atualizadas usando objetos do schema `sys`

* `PROCESS` para a tabela `INNODB_BUFFER_PAGE` do `INFORMATION_SCHEMA`

Certos instruments e consumers do Performance Schema devem ser habilitados e (para instruments) cronometrados para aproveitar totalmente os recursos do schema `sys`:

* Todos os instruments de `wait`
* Todos os instruments de `stage`
* Todos os instruments de `statement`
* Consumers `xxx_current` e `xxx_history_long` para todos os events

Você pode usar o próprio schema `sys` para habilitar todos os instruments e consumers adicionais:

```sql
CALL sys.ps_setup_enable_instrument('wait');
CALL sys.ps_setup_enable_instrument('stage');
CALL sys.ps_setup_enable_instrument('statement');
CALL sys.ps_setup_enable_consumer('current');
CALL sys.ps_setup_enable_consumer('history_long');
```

Note

Para muitos usos do schema `sys`, o Performance Schema padrão é suficiente para a coleta de dados. Habilitar todos os instruments e consumers mencionados acima tem um impacto no performance, portanto, é preferível habilitar apenas a configuração adicional de que você precisa. Além disso, lembre-se de que, se você habilitar a configuração adicional, poderá restaurar facilmente a configuração padrão desta forma:

```sql
CALL sys.ps_setup_reset_to_default(TRUE);
```