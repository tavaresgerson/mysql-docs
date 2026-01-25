#### 13.7.6.6 Instrução RESET

```sql
RESET reset_option [, reset_option] ...

reset_option: {
    MASTER
  | QUERY CACHE
  | SLAVE
}
```

A instrução [`RESET`](reset.html "13.7.6.6 RESET Statement") é usada para limpar o estado de várias operações do servidor. Você deve ter o privilégio [`RELOAD`](privileges-provided.html#priv_reload) para executar [`RESET`](reset.html "13.7.6.6 RESET Statement").

[`RESET`](reset.html "13.7.6.6 RESET Statement") atua como uma versão mais forte da instrução [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement"). Veja [Seção 13.7.6.3, “Instrução FLUSH”](flush.html "13.7.6.3 FLUSH Statement").

A instrução [`RESET`](reset.html "13.7.6.6 RESET Statement") causa um Commit implícito. Veja [Seção 13.3.3, “Instruções que Causam um Commit Implícito”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

A lista a seguir descreve os valores permitidos para a *`reset_option`* da instrução [`RESET`](reset.html "13.7.6.6 RESET Statement"):

* `RESET MASTER`

  Deleta todos os **Binary Logs** listados no arquivo de índice, redefine o arquivo de índice do **Binary Log** para ficar vazio e cria um novo arquivo de **Binary Log**.

* `RESET QUERY CACHE`

  Remove todos os resultados de **Query** do **Query Cache**.

  Nota

  O **Query Cache** está obsoleto desde o MySQL 5.7.20 e foi removido no MySQL 8.0. A obsolescência inclui [`RESET QUERY CACHE`](reset.html "13.7.6.6 RESET Statement").

* `RESET SLAVE`

  Faz com que a Replica se esqueça de sua posição de replicação nos **Binary Logs** da Source. Também redefine o **Relay Log** deletando quaisquer arquivos de **Relay Log** existentes e começando um novo.