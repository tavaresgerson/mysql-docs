#### 19.5.1.17 Replicação de documentos JSON

Antes do MySQL 8.0, uma atualização em uma coluna JSON era sempre escrita no log binário como o documento completo. No MySQL 8.0, é possível registrar atualizações parciais em documentos JSON (veja Atualizações Parciais de Valores JSON), o que é mais eficiente. O comportamento de registro depende do formato usado, conforme descrito aqui:

**Replicação baseada em declarações.** As atualizações parciais do JSON são sempre registradas como atualizações parciais. Isso não pode ser desativado ao usar o registro baseado em declarações.

**Replicação baseada em linhas.** As atualizações parciais do JSON não são registradas como tal por padrão, mas sim como documentos completos. Para habilitar o registro de atualizações parciais, defina `binlog_row_value_options=PARTIAL_JSON`. Se uma fonte de replicação tiver essa variável definida, as atualizações parciais recebidas dessa fonte serão tratadas e aplicadas por uma réplica, independentemente da configuração própria da variável da réplica.

Os servidores que executam o MySQL 8.0.2 ou versões anteriores não reconhecem os eventos de log usados para atualizações parciais de JSON. Por esse motivo, ao replicar para um servidor que executa o MySQL 8.0.3 ou versões posteriores, o `binlog_row_value_options` deve ser desativado na fonte, definindo essa variável para `''` (string vazio). Consulte a descrição dessa variável para obter mais informações.
