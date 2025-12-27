#### 15.7.8.7 Declaração de RESET PERSIST

```
RESET PERSIST [[IF EXISTS] system_var_name]
```

O comando `RESET PERSIST` remove as configurações de variáveis de sistema globais persistentes do arquivo de opção `mysqld-auto.cnf` no diretório de dados. A remoção de uma variável de sistema persistente faz com que a variável não seja mais inicializada a partir de `mysqld-auto.cnf` durante o inicialização do servidor. Para obter mais informações sobre variáveis de sistema persistentes e o arquivo `mysqld-auto.cnf`, consulte a Seção 7.1.9.3, “Variáveis de Sistema Persistentes”.

Os privilégios necessários para o comando `RESET PERSIST` dependem do tipo de variável de sistema a ser removida:

* Para variáveis de sistema dinâmicas, este comando requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio `SUPER` desatualizado).

* Para variáveis de sistema somente leitura, este comando requer os privilégios `SYSTEM_VARIABLES_ADMIN` e `PERSIST_RO_VARIABLES_ADMIN`.

Consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

Dependendo da presença ou ausência do nome da variável e das cláusulas `IF EXISTS`, o comando `RESET PERSIST` tem essas formas:

* Para remover todas as variáveis persistentes de `mysqld-auto.cnf`, use `RESET PERSIST` sem nomear nenhuma variável de sistema:

  ```
  RESET PERSIST;
  ```

  Você deve ter privilégios para remover tanto variáveis de sistema dinâmicas quanto variáveis somente leitura se o `mysqld-auto.cnf` contiver ambos os tipos de variáveis.

* Para remover uma variável de sistema persistente específica de `mysqld-auto.cnf`, nomeie-a na declaração:

  ```
  RESET PERSIST system_var_name;
  ```

  Isso inclui variáveis de sistema de plugins, mesmo que o plugin não esteja atualmente instalado. Se a variável não estiver presente no arquivo, ocorrerá um erro.

* Para remover uma variável de sistema persistente específica de `mysqld-auto.cnf`, mas gerar uma mensagem de aviso em vez de um erro se a variável não estiver presente no arquivo, adicione uma cláusula `IF EXISTS` à sintaxe anterior:

  ```
  RESET PERSIST IF EXISTS system_var_name;
  ```

`RESET PERSIST` não é afetado pelo valor da variável de sistema `persisted_globals_load`.

`RESET PERSIST` afeta o conteúdo da tabela `persisted_variables` do Schema de Desempenho porque o conteúdo da tabela corresponde ao conteúdo do arquivo `mysqld-auto.cnf`. Por outro lado, como `RESET PERSIST` não altera os valores das variáveis, ele não tem efeito sobre o conteúdo da tabela `variables_info` do Schema de Desempenho até que o servidor seja reiniciado.

Para obter informações sobre as variantes da instrução `RESET` que limpam o estado de outras operações do servidor, consulte a Seção 15.7.8.6, “Instrução RESET”.