#### 15.7.8.7 Declaração de RESTART PERSISTENTE

```
RESET PERSIST [[IF EXISTS] system_var_name]
```

`RESET PERSIST` remove as configurações de variáveis de sistema globais persistentes do arquivo de opção `mysqld-auto.cnf` no diretório de dados. A remoção de uma variável de sistema persistente faz com que a variável não seja mais inicializada a partir de `mysqld-auto.cnf` ao iniciar o servidor. Para obter mais informações sobre variáveis de sistema persistentes e o arquivo `mysqld-auto.cnf`, consulte a Seção 7.1.9.3, “Variáveis de Sistema Persistentes”.

Antes do MySQL 8.0.32, essa declaração não funcionava com variáveis cujo nome continha um caractere ponto (`.`), como as variáveis de cache de múltiplas chaves `MyISAM` e variáveis registradas por componentes. (Bug #33417357)

Os privilégios necessários para `RESET PERSIST` dependem do tipo de variável do sistema a ser removida:

- Para variáveis dinâmicas do sistema, essa declaração requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`).

- Para variáveis de sistema somente de leitura, essa declaração requer os privilégios `SYSTEM_VARIABLES_ADMIN` e `PERSIST_RO_VARIABLES_ADMIN`.

Consulte a Seção 7.1.9.1, “Privilégios de variáveis do sistema”.

Dependendo da presença ou ausência do nome da variável e das cláusulas `IF EXISTS` e `RESET PERSIST`, a instrução `RESET PERSIST` pode ter essas formas:

- Para remover todas as variáveis persistentes de `mysqld-auto.cnf`, use `RESET PERSIST` sem nomear nenhuma variável do sistema:

  ```
  RESET PERSIST;
  ```

  Você deve ter privilégios para remover variáveis de sistema dinâmicas e somente leitura se `mysqld-auto.cnf` contiver ambos os tipos de variáveis.

- Para remover uma variável persistente específica do `mysqld-auto.cnf`, nomeie-a na declaração:

  ```
  RESET PERSIST system_var_name;
  ```

  Isso inclui as variáveis do sistema de plugins, mesmo que o plugin não esteja instalado atualmente. Se a variável não estiver presente no arquivo, ocorrerá um erro.

- Para remover uma variável persistente específica do `mysqld-auto.cnf`, mas emitir um aviso em vez de um erro se a variável não estiver presente no arquivo, adicione uma cláusula `IF EXISTS` à sintaxe anterior:

  ```
  RESET PERSIST IF EXISTS system_var_name;
  ```

`RESET PERSIST` não é afetado pelo valor da variável de sistema `persisted_globals_load`.

`RESET PERSIST` afeta o conteúdo da tabela do Schema de Desempenho `persisted_variables` porque o conteúdo da tabela corresponde ao conteúdo do arquivo `mysqld-auto.cnf`. Por outro lado, como `RESET PERSIST` não altera os valores das variáveis, ele não tem efeito sobre o conteúdo da tabela do Schema de Desempenho `variables_info` até que o servidor seja reiniciado.

Para obter informações sobre as variantes da declaração `RESET` que limpam o estado de outras operações do servidor, consulte a Seção 15.7.8.6, “Declaração RESET”.
