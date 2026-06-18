#### 13.7.6.6 Instrução RESET

```sql
RESET reset_option [, reset_option] ...

reset_option: {
    MASTER
  | QUERY CACHE
  | SLAVE
}
```

A instrução `RESET` é usada para limpar o estado de várias operações do servidor. Você deve ter o privilégio `RELOAD` para executar `RESET`.

`RESET` atua como uma versão mais forte da instrução `FLUSH`. Veja Seção 13.7.6.3, “Instrução FLUSH”.

A instrução `RESET` causa um Commit implícito. Veja Seção 13.3.3, “Instruções que Causam um Commit Implícito”.

A lista a seguir descreve os valores permitidos para a *`reset_option`* da instrução `RESET`:

* `RESET MASTER`

  Deleta todos os **Binary Logs** listados no arquivo de índice, redefine o arquivo de índice do **Binary Log** para ficar vazio e cria um novo arquivo de **Binary Log**.

* `RESET QUERY CACHE`

  Remove todos os resultados de **Query** do **Query Cache**.

  Nota

  O **Query Cache** está obsoleto desde o MySQL 5.7.20 e foi removido no MySQL 8.0. A obsolescência inclui `RESET QUERY CACHE`.

* `RESET SLAVE`

  Faz com que a Replica se esqueça de sua posição de replicação nos **Binary Logs** da Source. Também redefine o **Relay Log** deletando quaisquer arquivos de **Relay Log** existentes e começando um novo.