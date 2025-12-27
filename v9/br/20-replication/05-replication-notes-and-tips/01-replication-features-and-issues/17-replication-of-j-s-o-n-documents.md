#### 19.5.1.17 Replicação de Documentos JSON

No MySQL 9.5, é possível registrar atualizações parciais de documentos JSON (veja Atualizações Parciais de Valores JSON). O comportamento de registro depende do formato utilizado, conforme descrito aqui:

**Replicação baseada em declarações.** As atualizações parciais JSON são sempre registradas como atualizações parciais. Isso não pode ser desativado ao usar o registro baseado em declarações.

**Replicação baseada em linhas.** As atualizações parciais JSON não são registradas como tal por padrão, mas sim como documentos completos. Para habilitar o registro de atualizações parciais, defina `binlog_row_value_options=PARTIAL_JSON`. Se uma fonte de replicação tiver essa variável definida, as atualizações parciais recebidas dessa fonte são tratadas e aplicadas por uma réplica, independentemente da configuração própria da variável da réplica.