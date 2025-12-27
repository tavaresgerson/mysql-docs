### 7.7.1 Instalação e Desinstalação de Funções Carregáveis

As funções carregáveis, como o nome sugere, devem ser carregadas no servidor antes de poderem ser usadas. O MySQL suporta o carregamento automático de funções durante a inicialização do servidor e o carregamento manual posteriormente.

Enquanto uma função carregável está carregada, as informações sobre ela estão disponíveis conforme descrito na Seção 7.7.2, “Obtendo Informações Sobre Funções Carregáveis”.

* Instalação de Funções Carregáveis
* Desinstalação de Funções Carregáveis
* Reinstalação ou Atualização de Funções Carregáveis

#### Instalação de Funções Carregáveis

Para carregar manualmente uma função carregável, use a instrução `CREATE FUNCTION`. Por exemplo:

```
CREATE FUNCTION metaphon
  RETURNS STRING
  SONAME 'udf_example.so';
```

O nome do arquivo base depende da sua plataforma. Sufixos comuns são `.so` para sistemas Unix e Unix-like, `.dll` para Windows.

`CREATE FUNCTION` tem esses efeitos:

* Carrega a função no servidor para torná-la imediatamente disponível.
* Registra a função na tabela `mysql.func` do sistema para torná-la persistente após reinicializações do servidor. Por essa razão, `CREATE FUNCTION` requer o privilégio `INSERT` para o banco de dados `mysql` do sistema.
* Adiciona a função à tabela `user_defined_functions` do Schema de Desempenho que fornece informações de tempo de execução sobre as funções carregáveis instaladas. Veja a Seção 7.7.2, “Obtendo Informações Sobre Funções Carregáveis”.

O carregamento automático de funções carregáveis ocorre durante a sequência normal de inicialização do servidor:

* Funções registradas na tabela `mysql.func` são instaladas.
* Componentes ou plugins instalados durante a inicialização podem instalar automaticamente funções relacionadas.
* A instalação automática de funções adiciona as funções à tabela `user_defined_functions` do Schema de Desempenho que fornece informações de tempo de execução sobre as funções instaladas.

Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela `mysql.func` não são carregadas e estão indisponíveis. Isso não se aplica a funções instaladas automaticamente por um componente ou plugin.

#### Desinstalação de Funções Carregáveis

Para remover uma função carregável, use a instrução `DROP FUNCTION`. Por exemplo:

```
DROP FUNCTION metaphon;
```

`DROP FUNCTION` tem esses efeitos:

* Descarrega a função para torná-la indisponível.
* Remove a função da tabela `mysql.func` do sistema. Por essa razão, `DROP FUNCTION` requer o privilégio `DELETE` para o banco de dados `mysql` do sistema. Como a função não está mais registrada na tabela `mysql.func`, o servidor não carrega a função durante reinicializações subsequentes.
* Remove a função da tabela `user_defined_functions` do Schema de Desempenho que fornece informações de tempo de execução sobre as funções carregáveis instaladas.

`DROP FUNCTION` não pode ser usado para desinstalar uma função carregável que foi instalada automaticamente por componentes ou plugins, em vez de ser usada com `CREATE FUNCTION`. Tal função também é desinstalada automaticamente quando o componente ou plugin que a instalou é desinstalado.

#### Reinstalação ou Atualização de Funções Carregáveis

Para reinstalar ou atualizar a biblioteca compartilhada associada a uma função carregável, execute uma instrução `DROP FUNCTION`, atualize a biblioteca compartilhada e, em seguida, execute uma instrução `CREATE FUNCTION`. Se você atualizar a biblioteca compartilhada primeiro e depois usar `DROP FUNCTION`, o servidor pode ser desligado inesperadamente.