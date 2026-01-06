### 14.21.1 Benefícios do Plugin memcached do InnoDB

Esta seção descreve as vantagens do plugin `daemon_memcached`. A combinação de tabelas `InnoDB` e **memcached** oferece vantagens em relação ao uso de cada uma delas isoladamente.

- O acesso direto ao mecanismo de armazenamento `InnoDB` evita a sobrecarga de análise e planejamento do SQL.

- Executar o **memcached** no mesmo espaço de processo do servidor MySQL evita o overhead de rede ao passar solicitações para frente e para trás.

- Os dados escritos usando o protocolo **memcached** são escritos de forma transparente em uma tabela `InnoDB`, sem passar pela camada de SQL do MySQL. Você pode controlar a frequência de escrita para obter um desempenho bruto maior ao atualizar dados não críticos.

- Os dados solicitados através do protocolo **memcached** são consultados de forma transparente a partir de uma tabela `InnoDB`, sem passar pela camada de SQL do MySQL.

- Solicitações subsequentes pelos mesmos dados são atendidas a partir do pool de buffer do `InnoDB`. O pool de buffer gerencia o cache em memória. Você pode ajustar o desempenho das operações intensivas em dados usando as opções de configuração do `InnoDB`.

- Os dados podem ser não estruturados ou estruturados, dependendo do tipo de aplicação. Você pode criar uma nova tabela para os dados ou usar tabelas existentes.

- O `InnoDB` pode lidar com a composição e decomposição de múltiplos valores de coluna em um único valor de item do **memcached**, reduzindo a quantidade de análise e concatenação de strings necessárias em sua aplicação. Por exemplo, você pode armazenar o valor de string `2|4|6|8` no cache **memcached** e fazer com que o `InnoDB` divida o valor com base em um caractere de separador, e então armazenar o resultado em quatro colunas numéricas.

- A transferência entre a memória e o disco é feita automaticamente, simplificando a lógica da aplicação.

- Os dados são armazenados em um banco de dados MySQL para proteção contra falhas, interrupções e corrupção.

- Você pode acessar a tabela subjacente `InnoDB` por meio do SQL para relatórios, análises, consultas ad hoc, carregamento em massa, cálculos transacionais em várias etapas, operações de conjunto, como união e interseção, e outras operações adequadas à expressividade e flexibilidade do SQL.

- Você pode garantir alta disponibilidade usando o plugin `daemon_memcached` em um servidor de origem em combinação com a replicação do MySQL.

- A integração do **memcached** com o MySQL oferece uma maneira de tornar os dados em memória persistentes, permitindo que você os use para tipos de dados mais significativos. Você pode usar mais operações de escrita como `add`, `incr` e similares em sua aplicação sem se preocupar com a perda de dados. Você pode parar e reiniciar o servidor **memcached** sem perder as atualizações feitas nos dados armazenados. Para se proteger contra interrupções inesperadas, você pode aproveitar as capacidades de recuperação de falhas, replicação e backup do **InnoDB**.

- A forma como o `InnoDB` realiza buscas rápidas de chaves primárias é uma combinação natural para as consultas de um único item do **memcached**. O caminho de acesso direto e de baixo nível ao banco de dados usado pelo plugin `daemon_memcached` é muito mais eficiente para buscas de chave-valor do que as consultas SQL equivalentes.

- As funcionalidades de serialização do **memcached**, que podem transformar estruturas de dados complexas, arquivos binários ou até mesmo blocos de código em strings armazenáveis, oferecem uma maneira simples de inserir esses objetos em um banco de dados.

- Como você pode acessar os dados subjacentes por meio do SQL, você pode gerar relatórios, pesquisar ou atualizar em várias chaves e chamar funções como `AVG()` e `MAX()` nos dados do **memcached**. Todas essas operações são caras ou complicadas usando o **memcached** por si só.

- Você não precisa carregar manualmente dados no **memcached** no momento do início. À medida que as chaves específicas são solicitadas por uma aplicação, os valores são recuperados automaticamente do banco de dados e armazenados na memória usando o pool de buffer do **InnoDB**.

- Como o **memcached** consome relativamente pouca CPU e sua pegada de memória é fácil de controlar, ele pode ser executado confortavelmente ao lado de uma instância do MySQL no mesmo sistema.

- Como a consistência dos dados é garantida por mecanismos usados para tabelas regulares do InnoDB, você não precisa se preocupar com dados **memcached** desatualizados ou com a lógica de fallback para consultar o banco de dados no caso de uma chave ausente.
