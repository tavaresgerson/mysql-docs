### 5.6.1 Instalação e Desinstalação de Funções Carregáveis

As funções carregáveis, como o nome sugere, devem ser carregadas no servidor antes de poderem ser usadas. O MySQL suporta o carregamento automático de funções durante a inicialização do servidor e o carregamento manual posteriormente.

Enquanto uma função carregável está sendo carregada, as informações sobre ela estão disponíveis conforme descrito em Seção 5.6.2, “Obtendo Informações Sobre Funções Carregáveis”.

- Instalando Funções Carregáveis
- Desinstalação de Funções Carregáveis
- Reinstalação ou Atualização de Funções Carregáveis

#### Instalando Funções Carregáveis

Para carregar uma função carregável manualmente, use a instrução `CREATE FUNCTION`. Por exemplo:

```sql
CREATE FUNCTION metaphon
  RETURNS STRING
  SONAME 'udf_example.so';
```

O nome de base do arquivo depende da sua plataforma. Sufixos comuns são `.so` para sistemas Unix e sistemas semelhantes ao Unix, `.dll` para Windows.

A função `CREATE FUNCTION` tem esses efeitos:

- Ele carrega a função no servidor para torná-la disponível imediatamente.

- Ele registra a função na tabela de sistema `mysql.func` para torná-la persistente após reinicializações do servidor. Por essa razão, `CREATE FUNCTION` requer o privilégio `INSERT` para o banco de dados do sistema `mysql`.

O carregamento automático de funções carregáveis ocorre durante a sequência normal de inicialização do servidor. O servidor carrega as funções registradas na tabela `mysql.func`. Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela não são carregadas e ficam indisponíveis.

#### Desinstalação de Funções Carregáveis

Para remover uma função carregável, use a instrução `DROP FUNCTION`. Por exemplo:

```sql
DROP FUNCTION metaphon;
```

`DROP FUNCTION` tem esses efeitos:

- Descarrega a função para torná-la indisponível.
- Ele remove a função da tabela `mysql.func` do sistema. Por essa razão, `DROP FUNCTION` requer o privilégio `DELETE` para o banco de dados `mysql`. Como a função não está mais registrada na tabela `mysql.func`, o servidor não carrega a função durante reinicializações subsequentes.

Enquanto uma função carregável está sendo carregada, informações sobre ela estão disponíveis na tabela `mysql.func` do sistema. Veja Seção 5.6.2, “Obtendo Informações Sobre Funções Carregáveis”. `CREATE FUNCTION` adiciona a função à tabela e `DROP FUNCTION` remove-a.

#### Reinicialização ou Atualização de Funções Carregáveis

Para reinstalar ou atualizar a biblioteca compartilhada associada a uma função carregável, execute uma declaração de `DROP FUNCTION`, atualize a biblioteca compartilhada e, em seguida, execute uma declaração de `CREATE FUNCTION`. Se você atualizar a biblioteca compartilhada primeiro e, em seguida, usar `DROP FUNCTION`, o servidor pode ser desligado inesperadamente.
