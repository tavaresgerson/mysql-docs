#### 14.18.1.3 Funções para Inspecionar e Configurar as Instâncias Máximas de Consenso de um Grupo

As seguintes funções permitem que você inspecione e configure o número máximo de instâncias de consenso que um grupo pode executar em paralelo.

* `group_replication_get_write_concurrency()`

  Verifique o número máximo de instâncias de consenso que um grupo pode executar em paralelo.

  Sintaxe:

  ```
  INT group_replication_get_write_concurrency()
  ```

  Esta função não tem parâmetros.

  Valor de retorno:

  O número máximo de instâncias de consenso atualmente configurado para o grupo.

  Exemplo:

  ```
  SELECT group_replication_get_write_concurrency()
  ```

  Para mais informações, consulte a Seção 20.5.1.3, “Usando Consenso de Escrita de Grupo de Replicação”.

* `group_replication_set_write_concurrency()`

  Configura o número máximo de instâncias de consenso que um grupo pode executar em paralelo. O privilégio `GROUP_REPLICATION_ADMIN` é necessário para usar esta função.

  Sintaxe:

  ```
  STRING group_replication_set_write_concurrency(instances)
  ```

  Argumentos:

  + *`members`*: Define o número máximo de instâncias de consenso que um grupo pode executar em paralelo. O valor padrão é 10, e os valores válidos são inteiros no intervalo de 10 a 200.

  Valor de retorno:

  Qualquer erro resultante como uma string.

  Exemplo:

  ```
  SELECT group_replication_set_write_concurrency(instances);
  ```

  Para mais informações, consulte a Seção 20.5.1.3, “Usando Consenso de Escrita de Grupo de Replicação”.