### 29.12.19 Tabelas de Clones do Schema de Desempenho

29.12.19.1 A tabela clone\_status

29.12.19.2 A tabela clone\_progress

Nota

As tabelas do Schema de Desempenho descritas aqui estão disponíveis a partir do MySQL 8.0.17.

As seções a seguir descrevem as tabelas do Schema de Desempenho associadas ao plugin de clone (consulte a Seção 7.6.7, “O Plugin de Clone”). As tabelas fornecem informações sobre operações de clonagem.

- `clone_status`: informações de status sobre a operação de clonagem atual ou a última executada.

- `clone_progress`: informações sobre o progresso da operação de clonagem atual ou executada anteriormente.

As tabelas de clone do esquema de desempenho são implementadas pelo plugin clone e são carregadas e descarregadas quando esse plugin é carregado e descarregado (consulte a Seção 7.6.7.1, “Instalando o Plugin Clone”). Não é necessário realizar nenhuma etapa de configuração especial para as tabelas. No entanto, as tabelas dependem do plugin clone estar habilitado. Se o plugin clone estiver carregado, mas desabilitado, as tabelas não serão criadas.

As tabelas do plugin de clone do Schema de Desempenho são usadas apenas na instância do servidor MySQL do destinatário. Os dados são mantidos mesmo após o desligamento e o reinício do servidor.
