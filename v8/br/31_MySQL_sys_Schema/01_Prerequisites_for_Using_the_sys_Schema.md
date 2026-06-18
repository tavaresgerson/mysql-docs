## 30.1 Pré-requisitos para usar o esquema sys

Antes de usar o esquema `sys`, os pré-requisitos descritos nesta seção devem ser atendidos.

Como o esquema `sys` fornece uma maneira alternativa de acessar o Schema de Desempenho, o Schema de Desempenho deve ser habilitado para que o esquema `sys` funcione. Veja a Seção 29.3, “Configuração de Inicialização do Schema de Desempenho”.

Para ter acesso total ao esquema `sys`, o usuário deve ter esses privilégios:

- `SELECT` em todas as tabelas e visualizações `sys`

- `EXECUTE` em todos os procedimentos e funções armazenadas `sys`

- `INSERT` e `UPDATE` para a tabela `sys_config`, se forem feitas alterações nela

- Privilégios adicionais para certos procedimentos e funções do esquema `sys` (como mencionado em suas descrições, por exemplo, o procedimento `ps_setup_save()`).

É também necessário ter privilégios para os objetos que estão por trás dos objetos do esquema `sys`:

- `SELECT` em quaisquer tabelas do Schema de Desempenho acessadas por objetos do Schema `sys` e `UPDATE` para quaisquer tabelas que serão atualizadas usando objetos do Schema `sys`

- `PROCESS` para a tabela `INFORMATION_SCHEMA` `INNODB_BUFFER_PAGE`

Certos instrumentos e consumidores do esquema de desempenho devem ser habilitados e (para os instrumentos) sincronizados para aproveitar ao máximo as capacidades do esquema `sys`:

- Todos os instrumentos `wait`
- Todos os instrumentos `stage`
- Todos os instrumentos `statement`
- Consumidores `xxx_current` e `xxx_history_long` para todos os eventos

Você pode usar o próprio esquema `sys` para habilitar todos os instrumentos e consumidores adicionais:

```
CALL sys.ps_setup_enable_instrument('wait');
CALL sys.ps_setup_enable_instrument('stage');
CALL sys.ps_setup_enable_instrument('statement');
CALL sys.ps_setup_enable_consumer('current');
CALL sys.ps_setup_enable_consumer('history_long');
```

Nota

Para muitas utilizações do esquema `sys`, o esquema de desempenho padrão é suficiente para a coleta de dados. Ativação de todos os instrumentos e consumidores mencionados acima tem um impacto no desempenho, portanto, é preferível ativar apenas a configuração adicional que você precisa. Além disso, lembre-se de que, se você ativar a configuração adicional, pode facilmente restaurar a configuração padrão da seguinte forma:

```
CALL sys.ps_setup_reset_to_default(TRUE);
```
