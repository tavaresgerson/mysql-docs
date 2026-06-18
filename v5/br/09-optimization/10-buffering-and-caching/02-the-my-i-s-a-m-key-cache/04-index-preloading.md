#### 8.10.2.4 Pré-carregamento do índice

Se houver blocos suficientes em um cache de chave para armazenar blocos de um índice inteiro, ou pelo menos os blocos correspondentes aos seus nós não-folha, faz sentido pré-carregar o cache de chave com blocos de índice antes de começar a usá-lo. A pré-carga permite que você coloque os blocos do índice da tabela em um buffer do cache de chave da maneira mais eficiente: lendo os blocos do índice do disco sequencialmente.

Sem pré-carregar, os blocos ainda são colocados na cache de chaves conforme necessário pelas consultas. Embora os blocos permaneçam na cache, porque há buffers suficientes para todos eles, eles são buscados no disco em ordem aleatória, e não sequencialmente.

Para pré-carregar um índice em um cache, use a instrução `LOAD INDEX INTO CACHE`. Por exemplo, a seguinte instrução pré-carrega os nós (blocos de índice) dos índices das tabelas `t1` e `t2`:

```sql
mysql> LOAD INDEX INTO CACHE t1, t2 IGNORE LEAVES;
+---------+--------------+----------+----------+
| Table   | Op           | Msg_type | Msg_text |
+---------+--------------+----------+----------+
| test.t1 | preload_keys | status   | OK       |
| test.t2 | preload_keys | status   | OK       |
+---------+--------------+----------+----------+
```

O modificador `IGNORE LEAVES` faz com que apenas os blocos dos nós não-folhos do índice sejam pré-carregados. Assim, a declaração mostrada pré-carrega todos os blocos do índice de `t1`, mas apenas os blocos dos nós não-folhos de `t2`.

Se um índice foi atribuído a um cache de chaves usando uma declaração `CACHE INDEX`, o pré-carregamento coloca blocos do índice nesse cache. Caso contrário, o índice é carregado no cache de chaves padrão.
