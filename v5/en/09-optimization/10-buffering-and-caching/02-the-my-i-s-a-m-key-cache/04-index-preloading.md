#### 8.10.2.4 Pré-carregamento de Index (Index Preloading)

Se houver blocos suficientes em um key cache para armazenar os blocos de um Index inteiro, ou pelo menos os blocos correspondentes aos seus nós não-folha (nonleaf nodes), faz sentido pré-carregar o key cache com blocos de Index antes de começar a usá-lo. O pré-carregamento permite que você coloque os blocos de Index da tabela em um buffer do key cache da maneira mais eficiente: lendo os blocos de Index do disco sequencialmente.

Sem o pré-carregamento, os blocos ainda são colocados no key cache conforme necessário pelas Queries. Embora os blocos permaneçam no cache, por haver buffers suficientes para todos eles, eles são buscados do disco em ordem aleatória, e não sequencialmente.

Para pré-carregar um Index em um cache, use a instrução `LOAD INDEX INTO CACHE`. Por exemplo, a instrução a seguir pré-carrega nós (blocos de Index) dos Indexes das tabelas `t1` e `t2`:

```sql
mysql> LOAD INDEX INTO CACHE t1, t2 IGNORE LEAVES;
+---------+--------------+----------+----------+
| Table   | Op           | Msg_type | Msg_text |
+---------+--------------+----------+----------+
| test.t1 | preload_keys | status   | OK       |
| test.t2 | preload_keys | status   | OK       |
+---------+--------------+----------+----------+
```

O modificador `IGNORE LEAVES` faz com que apenas blocos para os nós não-folha (nonleaf nodes) do Index sejam pré-carregados. Assim, a instrução mostrada pré-carrega todos os blocos de Index de `t1`, mas apenas blocos para os nós não-folha de `t2`.

Se um Index foi atribuído a um key cache usando uma instrução `CACHE INDEX`, o pré-carregamento coloca os blocos de Index nesse cache. Caso contrário, o Index é carregado no key cache padrão.