#### 10.10.2.4 Pré-carregamento do índice

Se houver blocos suficientes em um cache de chaves para armazenar blocos de um índice inteiro, ou pelo menos os blocos correspondentes aos seus nós não-folha, faz sentido pré-carregar o cache de chaves com blocos de índice antes de começar a usá-lo. O pré-carregamento permite que os blocos do índice de tabela sejam colocados em um buffer do cache de chaves da maneira mais eficiente: lendo os blocos de índice do disco sequencialmente.

Sem pré-carregamento, os blocos ainda são colocados no cache de chaves conforme necessário pelas consultas. Embora os blocos permaneçam no cache, porque há buffers suficientes para todos eles, eles são buscados do disco em ordem aleatória, e não sequencialmente.

Para pré-carregar um índice em um cache, use a instrução `LOAD INDEX INTO CACHE`. Por exemplo, a seguinte instrução pré-carrega os nós (blocos de índice) dos índices das tabelas `t1` e `t2`:

```
mysql> LOAD INDEX INTO CACHE t1, t2 IGNORE LEAVES;
+---------+--------------+----------+----------+
| Table   | Op           | Msg_type | Msg_text |
+---------+--------------+----------+----------+
| test.t1 | preload_keys | status   | OK       |
| test.t2 | preload_keys | status   | OK       |
+---------+--------------+----------+----------+
```

O modificador `IGNORE LEAVES` faz com que apenas os blocos para os nós não-folha do índice sejam pré-carregados. Assim, a instrução mostrada pré-carrega todos os blocos de índice de `t1`, mas apenas os blocos para os nós não-folha de `t2`.

Se um índice tiver sido atribuído a um cache de chaves usando a instrução `CACHE INDEX`, o pré-carregamento coloca blocos de índice nesse cache. Caso contrário, o índice é carregado no cache de chaves padrão.