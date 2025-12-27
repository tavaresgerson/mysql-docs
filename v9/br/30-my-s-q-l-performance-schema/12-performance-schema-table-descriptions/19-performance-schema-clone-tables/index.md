### 19.12.19 Clonar tabelas do Schema de Desempenho

19.12.19.1 Tabela clone_status

19.12.19.2 Tabela clone_progress

As seções a seguir descrevem as tabelas do Schema de Desempenho associadas ao plugin de clonagem (consulte a Seção 7.6.6, “O Plugin de Clonagem”). As tabelas fornecem informações sobre as operações de clonagem.

* `clone_status`: informações de status sobre a operação de clonagem atual ou executada anteriormente.

* `clone_progress`: informações de progresso sobre a operação de clonagem atual ou executada anteriormente.

As tabelas de clonagem do Schema de Desempenho são implementadas pelo plugin de clonagem e são carregadas e descarregadas quando o plugin é carregado e descarregado (consulte a Seção 7.6.6.1, “Instalando o Plugin de Clonagem”). Não é necessário realizar nenhuma etapa de configuração especial para as tabelas. No entanto, as tabelas dependem do plugin de clonagem estar habilitado. Se o plugin de clonagem estiver carregado, mas desabilitado, as tabelas não serão criadas.

As tabelas do plugin de clonagem do Schema de Desempenho são usadas apenas na instância do servidor MySQL do destinatário. Os dados são persistentes após o desligamento e o reinício do servidor.