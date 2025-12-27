### 10.11.1 Métodos de Bloqueio Interno

Esta seção discute o bloqueio interno, ou seja, o bloqueio realizado dentro do próprio servidor MySQL para gerenciar a concorrência por conteúdos de tabelas por múltiplas sessões. Esse tipo de bloqueio é interno porque é realizado inteiramente pelo servidor e não envolve outros programas. Para o bloqueio realizado em arquivos MySQL por outros programas, consulte a Seção 10.11.5, “Bloqueio Externo”.

* Bloqueio de Nível de Linha
* Bloqueio de Nível de Tabela
* Escolhendo o Tipo de Bloqueio

#### Bloqueio de Nível de Linha

O MySQL usa bloqueio de nível de linha para tabelas `InnoDB` para suportar acesso de escrita simultâneo por múltiplas sessões, tornando-as adequadas para aplicações multiusuário, altamente concorrentes e OLTP.

Para evitar deadlocks ao realizar múltiplas operações de escrita concorrentes em uma única tabela `InnoDB`, adquira os bloqueios necessários no início da transação emitindo uma declaração `SELECT ... FOR UPDATE` para cada grupo de linhas que espera ser modificado, mesmo que as declarações de alteração de dados venham mais tarde na transação. Se as transações modificarem ou bloquear mais de uma tabela, emita as declarações aplicáveis na mesma ordem dentro de cada transação. Deadlocks afetam o desempenho em vez de representar um erro grave, porque o `InnoDB` detecta automaticamente as condições de deadlock por padrão e desfaz uma das transações afetadas.

Em sistemas de alta concorrência, a detecção de deadlocks pode causar um atraso quando vários threads aguardam o mesmo bloqueio. Às vezes, pode ser mais eficiente desativar a detecção de deadlocks e confiar no ajuste `innodb_lock_wait_timeout` para o rollback da transação quando um deadlock ocorre. A detecção de deadlocks pode ser desativada usando a opção de configuração `innodb_deadlock_detect`.

Vantagens do bloqueio de nível de linha:

* Menos conflitos de bloqueio quando diferentes sessões acessam diferentes linhas.

* Menos alterações para reversões.
* Possível bloquear uma única linha por um longo tempo.

#### Bloqueio em Nível de Tabela

O MySQL utiliza o bloqueio em nível de tabela para as tabelas `MyISAM`, `MEMORY` e `MERGE`, permitindo que apenas uma sessão atualize essas tabelas de cada vez. Esse nível de bloqueio torna esses motores de armazenamento mais adequados para aplicações de leitura, leitura quase exclusiva ou de um único usuário.

Esses motores de armazenamento evitam deadlocks ao solicitar sempre todos os bloqueios necessários de uma vez no início de uma consulta e sempre bloqueando as tabelas na mesma ordem. A compensação é que essa estratégia reduz a concorrência; outras sessões que desejam modificar a tabela devem esperar até que o comando de alteração de dados atualizado termine.

Vantagens do bloqueio em nível de tabela:

* Menos memória necessária (o bloqueio de linha requer memória por linha ou grupo de linhas bloqueadas)

* Rápido quando usado em uma grande parte da tabela, pois apenas um único bloqueio está envolvido.

* Rápido se você frequentemente fizer operações `GROUP BY` em uma grande parte dos dados ou precisar percorrer toda a tabela com frequência.

O MySQL concede bloqueios de escrita em nível de tabela da seguinte forma:

1. Se não houver bloqueios na tabela, coloque um bloqueio de escrita nela.

2. Caso contrário, coloque a solicitação de bloqueio na fila de bloqueio de escrita.

O MySQL concede bloqueios de leitura em nível de tabela da seguinte forma:

1. Se não houver bloqueios de escrita na tabela, coloque um bloqueio de leitura nela.

2. Caso contrário, coloque a solicitação de bloqueio na fila de bloqueio de leitura.

As atualizações de tabela são priorizadas acima das recuperações de tabela. Portanto, quando um bloqueio é liberado, o bloqueio fica disponível para os pedidos na fila de bloqueio de escrita e, em seguida, para os pedidos na fila de bloqueio de leitura. Isso garante que as atualizações em uma tabela não sejam "esgotadas", mesmo quando há uma atividade pesada de `SELECT` para a tabela. No entanto, se houver muitas atualizações para uma tabela, as instruções `SELECT` aguardam até que não haja mais atualizações.

Para obter informações sobre a alteração da prioridade de leituras e escritas, consulte a Seção 10.11.2, “Problemas de Bloqueio de Tabela”.

Você pode analisar a contenção de bloqueio de tabela em seu sistema verificando as variáveis de status `Table_locks_immediate` e `Table_locks_waited`, que indicam o número de vezes que os pedidos de bloqueio de tabela puderam ser concedidos imediatamente e o número que teve que esperar, respectivamente:

```
mysql> SHOW STATUS LIKE 'Table%';
+-----------------------+---------+
| Variable_name         | Value   |
+-----------------------+---------+
| Table_locks_immediate | 1151552 |
| Table_locks_waited    | 15324   |
+-----------------------+---------+
```

As tabelas de bloqueio do Schema de Desempenho também fornecem informações de bloqueio. Consulte a Seção 29.12.13, “Tabelas de Bloqueio do Schema de Desempenho”.

O motor de armazenamento `MyISAM` suporta inserções concorrentes para reduzir a contenção entre leitores e escritores para uma determinada tabela: Se uma tabela `MyISAM` não tiver blocos livres no meio do arquivo de dados, as linhas são sempre inseridas no final do arquivo de dados. Nesse caso, você pode misturar livremente instruções `INSERT` e `SELECT` concorrentes para uma tabela `MyISAM` sem bloqueios. Ou seja, você pode inserir linhas em uma tabela `MyISAM` ao mesmo tempo que outros clientes estão lendo dela. Fendas podem resultar de linhas terem sido excluídas ou atualizadas no meio da tabela. Se houver fendas, as inserções concorrentes são desativadas, mas são ativadas novamente automaticamente quando todos os buracos são preenchidos com novos dados. Para controlar esse comportamento, use a variável de sistema `concurrent_insert`. Consulte a Seção 10.11.3, “Inserções Concorrentes”.

Se você adquirir um bloqueio de tabela explicitamente com `LOCK TABLES`, você pode solicitar um bloqueio `READ LOCAL` em vez de um bloqueio `READ` para permitir que outras sessões realizem inserções concorrentes enquanto você tem a tabela bloqueada.

Para realizar muitas operações `INSERT` e `SELECT` em uma tabela `t1` quando inserções concorrentes não são possíveis, você pode inserir linhas em uma tabela temporária `temp_t1` e atualizar a tabela real com as linhas da tabela temporária:

```
mysql> LOCK TABLES t1 WRITE, temp_t1 WRITE;
mysql> INSERT INTO t1 SELECT * FROM temp_t1;
mysql> DELETE FROM temp_t1;
mysql> UNLOCK TABLES;
```

#### Escolhendo o Tipo de Bloqueio

Geralmente, os bloqueios de tabela são superiores aos bloqueios de nível de linha nos seguintes casos:

* A maioria das instruções para a tabela são leituras.
* As instruções para a tabela são uma mistura de leituras e escritas, onde as escritas são atualizações ou exclusões para uma única linha que pode ser recuperada com uma única leitura de chave:

  ```
  UPDATE tbl_name SET column=value WHERE unique_key_col=key_value;
  DELETE FROM tbl_name WHERE unique_key_col=key_value;
  ```

* `SELECT` combinado com instruções `INSERT` concorrentes e poucas instruções `UPDATE` ou `DELETE`.
* Muitas varreduras ou operações `GROUP BY` em toda a tabela sem nenhum escritor.

Com bloqueios de nível superior, você pode ajustar mais facilmente as aplicações ao suportar bloqueios de diferentes tipos, porque o overhead do bloqueio é menor do que para bloqueios de nível de linha.

Opções além do bloqueio de nível de linha:

* Versionamento (como o usado no MySQL para inserções concorrentes) onde é possível ter um escritor ao mesmo tempo que muitos leitores. Isso significa que o banco de dados ou a tabela suportam diferentes visões dos dados dependendo da data de início do acesso. Outros termos comuns para isso são “viagem no tempo”, “cópia com escrita” ou “cópia sob demanda”.

* A cópia sob demanda é, em muitos casos, superior ao bloqueio de nível de linha. No entanto, no pior dos casos, pode usar muito mais memória do que usar blocos normais.

* Em vez de usar bloqueios de nível de linha, você pode usar bloqueios de nível de aplicativo, como os fornecidos por `GET_LOCK()` e `RELEASE_LOCK()` no MySQL. Estes são bloqueios aconselhados, então eles funcionam apenas com aplicativos que cooperam uns com os outros. Veja a Seção 14.14, “Funções de Bloqueio”.