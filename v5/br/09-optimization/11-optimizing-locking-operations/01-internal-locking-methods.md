### 8.11.1 Métodos de bloqueio interno

Esta seção discute o bloqueio interno, ou seja, o bloqueio realizado dentro do próprio servidor MySQL para gerenciar a concorrência pelo conteúdo da tabela por várias sessões. Esse tipo de bloqueio é interno porque é realizado inteiramente pelo servidor e não envolve outros programas. Para o bloqueio realizado em arquivos do MySQL por outros programas, consulte a Seção 8.11.5, “Bloqueio Externo”.

- Bloqueio de nível de linha
- Bloqueio em nível de tabela
- Escolhendo o Tipo de Fechamento

#### Bloqueio de nível de linha

O MySQL utiliza o bloqueio de nível de linha para as tabelas `InnoDB` para suportar o acesso de escrita simultâneo por múltiplas sessões, tornando-as adequadas para aplicações multiusuário, altamente concorrentes e OLTP.

Para evitar impasses ao realizar operações de escrita concorrentes múltiplas em uma única tabela `InnoDB`, adquira as permissões necessárias no início da transação, emitindo uma declaração `SELECT ... FOR UPDATE` para cada grupo de linhas que espera ser modificado, mesmo que as declarações de alteração de dados venham mais tarde na transação. Se as transações modificarem ou bloquearem mais de uma tabela, emita as declarações aplicáveis na mesma ordem dentro de cada transação. Impasses afetam o desempenho, e não representam um erro grave, porque o `InnoDB` detecta automaticamente as condições de impasse e desfaz uma das transações afetadas.

Em sistemas de alta concorrência, a detecção de travamento pode causar um atraso quando vários threads aguardam o mesmo bloqueio. Às vezes, pode ser mais eficiente desabilitar a detecção de travamento e confiar na configuração `innodb_lock_wait_timeout` para o rollback de transações quando ocorre um travamento. A detecção de travamento pode ser desativada usando a opção de configuração `innodb_deadlock_detect`.

Vantagens do bloqueio em nível de linha:

- Menos conflitos de bloqueio quando diferentes sessões acessam diferentes linhas.

- Menos mudanças para recuos.

- É possível bloquear uma única linha por um longo tempo.

#### Bloqueio em nível de tabela

O MySQL utiliza o bloqueio de nível de tabela para as tabelas `MyISAM`, `MEMORY` e `MERGE`, permitindo que apenas uma sessão atualize essas tabelas de cada vez. Esse nível de bloqueio torna esses motores de armazenamento mais adequados para aplicações de leitura apenas, leitura predominante ou de um único usuário.

Esses motores de armazenamento evitam deadlocks ao solicitar sempre todas as chaves necessárias de uma vez no início de uma consulta e sempre bloqueando as tabelas na mesma ordem. O compromisso é que essa estratégia reduz a concorrência; outras sessões que desejam modificar a tabela devem esperar até que a instrução de alteração de dados atualizada termine.

Vantagens do bloqueio em nível de tabela:

- Necessita de memória relativamente pequena (o bloqueio de linhas requer memória por linha ou grupo de linhas bloqueadas)

- Rápido quando usado em uma grande parte da mesa, pois apenas um único bloqueio está envolvido.

- Faça um cache se você fizer frequentemente operações `GROUP BY` em uma grande parte dos dados ou precisar pesquisar toda a tabela com frequência.

O MySQL concede bloqueios de escrita de tabela da seguinte forma:

1. Se não houver bloqueios na mesa, coloque um bloqueio de escrita nele.

2. Caso contrário, coloque o pedido de bloqueio na fila de bloqueio de escrita.

O MySQL concede bloqueios de leitura de tabela da seguinte forma:

1. Se não houver bloqueios de escrita na tabela, coloque um bloqueio de leitura nela.

2. Caso contrário, coloque o pedido de bloqueio na fila de bloqueio de leitura.

As atualizações de tabela têm prioridade maior do que os acessos à tabela. Portanto, quando um bloqueio é liberado, ele fica disponível para os pedidos na fila de bloqueio de escrita e, em seguida, para os pedidos na fila de bloqueio de leitura. Isso garante que as atualizações de uma tabela não sejam "esgotadas", mesmo quando há uma atividade pesada de `SELECT` para a tabela. No entanto, se houver muitas atualizações para uma tabela, as instruções `SELECT` aguardam até que não haja mais atualizações.

Para obter informações sobre como alterar a prioridade de leituras e escritas, consulte a Seção 8.11.2, “Problemas de bloqueio de tabela”.

Você pode analisar a disputa por bloqueio de tabela no seu sistema verificando as variáveis de status `Table_locks_immediate` e `Table_locks_waited`, que indicam o número de vezes que os pedidos de bloqueio de tabela puderam ser concedidos imediatamente e o número que teve que esperar, respectivamente:

```sql
mysql> SHOW STATUS LIKE 'Table%';
+-----------------------+---------+
| Variable_name         | Value   |
+-----------------------+---------+
| Table_locks_immediate | 1151552 |
| Table_locks_waited    | 15324   |
+-----------------------+---------+
```

As tabelas de bloqueio do Schema de Desempenho também fornecem informações de bloqueio. Veja a Seção 25.12.12, “Tabelas de Bloqueio do Schema de Desempenho”.

O mecanismo de armazenamento `MyISAM` suporta inserções concorrentes para reduzir a concorrência entre leitores e escritores para uma determinada tabela: Se uma tabela `MyISAM` não tiver blocos livres no meio do arquivo de dados, as linhas são sempre inseridas no final do arquivo de dados. Nesse caso, você pode misturar livremente instruções `INSERT` e `SELECT` concorrentes para uma tabela `MyISAM` sem bloqueios. Ou seja, você pode inserir linhas em uma tabela `MyISAM` ao mesmo tempo em que outros clientes estão lendo dela. Fendas podem resultar da remoção ou atualização de linhas no meio da tabela. Se houver fendas, as inserções concorrentes são desativadas, mas são ativadas novamente automaticamente quando todos os buracos são preenchidos com novos dados. Para controlar esse comportamento, use a variável de sistema `concurrent_insert`. Veja a Seção 8.11.3, “Inserções Concorrentes”.

Se você adquirir um bloqueio de tabela explicitamente com `LOCK TABLES`, você pode solicitar um bloqueio `READ LOCAL` em vez de um bloqueio `READ` para permitir que outras sessões realizem inserções concorrentes enquanto você tem a tabela bloqueada.

Para realizar muitas operações `INSERT` e `SELECT` em uma tabela `t1` quando as inserções concorrentes não são possíveis, você pode inserir linhas em uma tabela temporária `temp_t1` e atualizar a tabela real com as linhas da tabela temporária:

```sql
mysql> LOCK TABLES t1 WRITE, temp_t1 WRITE;
mysql> INSERT INTO t1 SELECT * FROM temp_t1;
mysql> DELETE FROM temp_t1;
mysql> UNLOCK TABLES;
```

#### Escolhendo o Tipo de Fechamento

Geralmente, os bloqueios de tabela são superiores aos bloqueios de nível de linha nos seguintes casos:

- A maioria das declarações para a tabela são leituras.

- As declarações para a tabela são uma mistura de leituras e escritas, onde as escritas são atualizações ou exclusões de uma única linha que podem ser recuperadas com uma única leitura de chave:

  ```sql
  UPDATE tbl_name SET column=value WHERE unique_key_col=key_value;
  DELETE FROM tbl_name WHERE unique_key_col=key_value;
  ```

- `SELECT` combinado com declarações `INSERT` concorrentes e poucas declarações `UPDATE` ou `DELETE`.

- Muitas varreduras ou operações `GROUP BY` em toda a tabela sem nenhum escritor.

Com bloqueios de nível superior, você pode ajustar mais facilmente as aplicações ao suportar bloqueios de diferentes tipos, porque o overhead do bloqueio é menor do que para bloqueios de nível de linha.

Outras opções além do bloqueio em nível de linha:

- Versão (como a usada no MySQL para inserções concorrentes), onde é possível ter um escritor ao mesmo tempo que muitos leitores. Isso significa que o banco de dados ou a tabela suporta diferentes visualizações dos dados dependendo da data em que o acesso começa. Outros termos comuns para isso são “viagem no tempo”, “cópia no momento da escrita” ou “cópia sob demanda”.

- A cópia sob demanda é, em muitos casos, superior ao bloqueio de nível de linha. No entanto, no pior dos casos, pode consumir muito mais memória do que o uso de bloqueios normais.

- Em vez de usar bloqueios de nível de linha, você pode usar bloqueios de nível de aplicativo, como os fornecidos por `GET_LOCK()` e `RELEASE_LOCK()` no MySQL. Estes são bloqueios aconselhados, então eles funcionam apenas com aplicativos que cooperam uns com os outros. Veja a Seção 12.14, “Funções de Bloqueio”.
