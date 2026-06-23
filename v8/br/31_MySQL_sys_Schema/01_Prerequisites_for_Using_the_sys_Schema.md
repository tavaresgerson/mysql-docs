## 30.1 Requisitos para usar o esquema sys

Antes de usar o esquema `sys`, os pré-requisitos descritos nesta seção devem ser atendidos.

Como o esquema `sys` fornece um meio alternativo de acesso ao Schema de Desempenho, o Schema de Desempenho deve ser habilitado para que o esquema `sys` funcione. Veja a Seção 29.3, “Configuração de Inicialização do Schema de Desempenho”.

Para ter acesso total ao esquema `sys`, o usuário deve ter esses privilégios:

* `SELECT` em todas as tabelas e visualizações `sys`

* `EXECUTE` em todos os procedimentos e funções armazenadas `sys`

* `INSERT` e `UPDATE` para a tabela `sys_config`, se houver alterações a serem feitas

* Privilegios adicionais para certos procedimentos e funções do esquema `sys`, conforme observado em suas descrições (por exemplo, o procedimento `ps_setup_save()`)

É também necessário ter privilégios para os objetos que fundamentam os objetos do esquema `sys`:

* `SELECT` em quaisquer tabelas do Schema de Desempenho acessadas por objetos do esquema `sys`, e `UPDATE` para quaisquer tabelas que devam ser atualizadas usando objetos do esquema `sys`

* `PROCESS` para a tabela `INFORMATION_SCHEMA` `INNODB_BUFFER_PAGE`

Certos instrumentos e consumidores do Schema de Desempenho devem ser habilitados e (para instrumentos) sincronizados para aproveitar plenamente as capacidades do esquema `sys`:

* Todos os instrumentos `wait` * Todos os instrumentos `stage` * Todos os instrumentos `statement` * Consumidores `xxx_current` e `xxx_history_long` para todos os eventos

Você pode usar o próprio esquema `sys` para habilitar todos os instrumentos e consumidores adicionais:

```
CALL sys.ps_setup_enable_instrument('wait');
CALL sys.ps_setup_enable_instrument('stage');
CALL sys.ps_setup_enable_instrument('statement');
CALL sys.ps_setup_enable_consumer('current');
CALL sys.ps_setup_enable_consumer('history_long');
```

Nota

Para muitas aplicações do esquema `sys`, o esquema de desempenho padrão é suficiente para a coleta de dados. A ativação de todos os instrumentos e consumidores mencionados acima tem um impacto no desempenho, portanto, é preferível ativar apenas a configuração adicional que você precisa. Além disso, lembre-se de que, se você ativar a configuração adicional, pode facilmente restaurar a configuração padrão da seguinte forma:

```
CALL sys.ps_setup_reset_to_default(TRUE);
```