### 7.7.1 Instalação e Desinstalação de Funções Carregáveis

As funções carregáveis, como o nome indica, devem ser carregadas no servidor antes de serem usadas. O MySQL suporta o carregamento automático de funções durante a inicialização do servidor e o carregamento manual posteriormente.

Enquanto uma função carregável estiver carregada, as informações sobre ela estão disponíveis, conforme descrito na secção 7.7.2, "Obtenção de informações sobre funções carregáveis".

- Instalação de funções carregáveis
- Desinstalar funções carregáveis
- Reinstalar ou atualizar funções carregáveis

#### Instalação de funções carregáveis

Para carregar uma função manualmente, use a instrução `CREATE FUNCTION`.

```
CREATE FUNCTION metaphon
  RETURNS STRING
  SONAME 'udf_example.so';
```

O nome da base de arquivos depende da sua plataforma. Sufícios comuns são `.so` para Unix e sistemas semelhantes a Unix, `.dll` para Windows.

O `CREATE FUNCTION` tem estes efeitos:

- Ele carrega a função no servidor para torná-la disponível imediatamente.
- Ele registra a função na tabela de sistema `mysql.func` para torná-la persistente em reinicializações de servidor. Por esta razão, `CREATE FUNCTION` requer o privilégio `INSERT` para o banco de dados do sistema `mysql`.
- Ele adiciona a função à tabela de Performance Schema `user_defined_functions` que fornece informações de tempo de execução sobre funções carregáveis instaladas.

O carregamento automático de funções carregáveis ocorre durante a sequência normal de inicialização do servidor:

- As funções registadas na tabela `mysql.func` estão instaladas.
- Componentes ou plugins instalados na inicialização podem instalar automaticamente funções relacionadas.
- A instalação automática de funções adiciona as funções à tabela de Performance Schema `user_defined_functions` que fornece informações de tempo de execução sobre funções instaladas.

Se o servidor é iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela `mysql.func` não são carregadas e não estão disponíveis. Isto não se aplica às funções instaladas automaticamente por um componente ou plugin.

#### Desinstalar funções carregáveis

Para remover uma função carregável, use a instrução `DROP FUNCTION`.

```
DROP FUNCTION metaphon;
```

O `DROP FUNCTION` tem estes efeitos:

- Descarrega a função para a tornar indisponível.
- Ele remove a função da tabela de sistema `mysql.func`. Por esta razão, `DROP FUNCTION` requer o privilégio `DELETE` para o banco de dados do sistema `mysql`. Com a função não mais registrada na tabela `mysql.func`, o servidor não carrega a função durante reinicializações subsequentes.
- Ele remove a função da tabela de Performance Schema `user_defined_functions` que fornece informações de tempo de execução sobre funções carregáveis instaladas.

`DROP FUNCTION` não pode ser usado para desinstalar uma função carregável que é instalada automaticamente por componentes ou plugins em vez de usar `CREATE FUNCTION`.

#### Reinstalar ou atualizar funções carregáveis

Para reinstalar ou atualizar a biblioteca compartilhada associada a uma função carregável, emita uma instrução `DROP FUNCTION`, atualize a biblioteca compartilhada e emita uma instrução `CREATE FUNCTION`. Se você atualizar a biblioteca compartilhada primeiro e depois usar `DROP FUNCTION`, o servidor pode fechar inesperadamente.
