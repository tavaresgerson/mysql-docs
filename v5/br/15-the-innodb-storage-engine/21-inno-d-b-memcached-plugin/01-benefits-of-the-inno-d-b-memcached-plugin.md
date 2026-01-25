### 14.21.1 Benefícios do Plugin InnoDB memcached

Esta seção descreve as vantagens do plugin `daemon_memcached`. A combinação de tabelas `InnoDB` e **memcached** oferece vantagens sobre o uso de qualquer um deles isoladamente.

* O acesso direto ao `InnoDB` storage engine evita a sobrecarga de parsing e planejamento de SQL.

* Executar o **memcached** no mesmo espaço de processo que o servidor MySQL evita a sobrecarga de rede (network overhead) de passar requests de um lado para o outro.

* Os dados escritos usando o protocolo **memcached** são gravados de forma transparente em uma tabela `InnoDB`, sem passar pela camada SQL do MySQL. Você pode controlar a frequência das writes para alcançar um raw performance mais alto ao atualizar dados não críticos.

* Os dados solicitados através do protocolo **memcached** são consultados (queried) de forma transparente em uma tabela `InnoDB`, sem passar pela camada SQL do MySQL.

* Requests subsequentes para os mesmos dados são atendidas pelo `InnoDB` Buffer Pool. O Buffer Pool gerencia o caching in-memory. Você pode ajustar o performance de operações com uso intensivo de dados usando as opções de configuração do `InnoDB`.

* Os dados podem ser não estruturados ou estruturados, dependendo do tipo de aplicação. Você pode criar uma nova tabela para os dados ou usar tabelas existentes.

* O `InnoDB` pode lidar com a composição e decomposição de múltiplos valores de coluna em um único valor de item do **memcached**, reduzindo a quantidade de parsing de string e concatenação exigida na sua aplicação. Por exemplo, você pode armazenar o valor de string `2|4|6|8` no cache do **memcached** e fazer com que o `InnoDB` divida o valor com base em um caractere separador, armazenando o resultado em quatro colunas numéricas.

* A transferência entre memória e disco é tratada automaticamente, simplificando a lógica da aplicação.

* Os dados são armazenados em um Database MySQL para proteção contra crashes, interrupções (outages) e corrupção.

* Você pode acessar a tabela `InnoDB` subjacente através de SQL para reporting, análise, ad hoc queries, bulk loading, cálculos transacionais de múltiplas etapas, operações de conjunto como union e intersection, e outras operações adequadas à expressividade e flexibilidade do SQL.

* Você pode garantir alta disponibilidade usando o plugin `daemon_memcached` em um source server em combinação com o MySQL Replication.

* A integração do **memcached** com o MySQL fornece uma maneira de tornar os dados in-memory persistentes, para que você possa usá-los para tipos de dados mais significativos. Você pode usar mais operações de write como `add`, `incr` e similares na sua aplicação sem se preocupar com a perda de dados. Você pode parar e iniciar o servidor **memcached** sem perder as atualizações feitas nos dados em cache. Para se proteger contra interrupções inesperadas, você pode aproveitar os recursos de Crash Recovery, Replication e Backup do `InnoDB`.

* A maneira como o `InnoDB` realiza lookups rápidos de Primary Key é uma adaptação natural para **memcached** single-item queries. O caminho de acesso direto e de baixo nível ao Database usado pelo plugin `daemon_memcached` é muito mais eficiente para key-value lookups do que SQL Queries equivalentes.

* Os recursos de serialization do **memcached**, que podem transformar estruturas de dados complexas, arquivos binários ou até mesmo code blocks em strings armazenáveis, oferecem uma maneira simples de inserir esses objetos em um Database.

* Como você pode acessar os dados subjacentes via SQL, você pode produzir relatórios (reports), pesquisar ou atualizar em múltiplas keys e chamar funções como `AVG()` e `MAX()` nos dados do **memcached**. Todas essas operações são caras ou complicadas usando o **memcached** por si só.

* Você não precisa carregar dados manualmente no **memcached** na inicialização (startup). À medida que keys específicas são solicitadas por uma aplicação, os valores são recuperados do Database automaticamente e armazenados em cache (cached) in-memory usando o `InnoDB` Buffer Pool.

* Como o **memcached** consome relativamente pouca CPU, e seu footprint de memória é fácil de controlar, ele pode ser executado confortavelmente junto a uma instância MySQL no mesmo sistema.

* Como a consistência dos dados é imposta por mecanismos usados para tabelas `InnoDB` regulares, você não precisa se preocupar com dados **memcached** desatualizados (stale) ou com lógica de fallback para realizar a Query no Database no caso de uma key ausente.