### 5.6.1 Instalando e Desinstalando Funções Carregáveis (Loadable Functions)

Funções carregáveis (Loadable functions), como o nome sugere, devem ser carregadas no Server antes que possam ser usadas. O MySQL suporta o carregamento automático de funções durante a inicialização do Server e o carregamento manual posteriormente.

Enquanto uma função carregável estiver carregada, as informações sobre ela estarão disponíveis conforme descrito na [Seção 5.6.2, “Obtendo Informações Sobre Funções Carregáveis (Loadable Functions)”](obtaining-loadable-function-information.html "5.6.2 Obtendo Informações Sobre Funções Carregáveis").

* [Instalando Funções Carregáveis](function-loading.html#loadable-function-installing "Instalando Funções Carregáveis")
* [Desinstalando Funções Carregáveis](function-loading.html#loadable-function-uninstalling "Desinstalando Funções Carregáveis")
* [Reinstalando ou Fazendo Upgrade de Funções Carregáveis](function-loading.html#loadable-function-upgrading "Reinstalando ou Fazendo Upgrade de Funções Carregáveis")

#### Instalando Funções Carregáveis

Para carregar uma função carregável manualmente, use o Statement [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions"). Por exemplo:

```sql
CREATE FUNCTION metaphon
  RETURNS STRING
  SONAME 'udf_example.so';
```

O nome base do arquivo depende da sua plataforma. Os sufixos comuns são `.so` para sistemas Unix e semelhantes a Unix, e `.dll` para Windows.

[`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") tem os seguintes efeitos:

* Carrega a função no Server para torná-la disponível imediatamente.

* Registra a função na tabela de sistema `mysql.func` para torná-la persistente após reinicializações do Server. Por esta razão, [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") requer o Privilege [`INSERT`](privileges-provided.html#priv_insert) para o Database de sistema `mysql`.

O carregamento automático de funções carregáveis ocorre durante a sequência normal de inicialização do Server. O Server carrega funções registradas na tabela `mysql.func`. Se o Server for iniciado com a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables), as funções registradas na tabela não são carregadas e ficam indisponíveis.

#### Desinstalando Funções Carregáveis

Para remover uma função carregável, use o Statement [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions"). Por exemplo:

```sql
DROP FUNCTION metaphon;
```

[`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") tem os seguintes efeitos:

* Descarrega a função para torná-la indisponível.
* Remove a função da tabela de sistema `mysql.func`. Por esta razão, [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") requer o Privilege [`DELETE`](privileges-provided.html#priv_delete) para o Database de sistema `mysql`. Como a função não está mais registrada na tabela `mysql.func`, o Server não a carregará durante as reinicializações subsequentes.

Enquanto uma função carregável estiver carregada, as informações sobre ela estarão disponíveis na tabela de sistema `mysql.func`. Consulte a [Seção 5.6.2, “Obtendo Informações Sobre Funções Carregáveis (Loadable Functions)”](obtaining-loadable-function-information.html "5.6.2 Obtendo Informações Sobre Funções Carregáveis"). [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") adiciona a função à tabela e [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") a remove.

#### Reinstalando ou Fazendo Upgrade de Funções Carregáveis

Para reinstalar ou fazer upgrade da biblioteca compartilhada associada a uma função carregável, execute um Statement [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions"), faça o upgrade da biblioteca compartilhada e, em seguida, execute um Statement [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions"). Se você fizer o upgrade da biblioteca compartilhada primeiro e depois usar [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions"), o Server pode ser encerrado inesperadamente.