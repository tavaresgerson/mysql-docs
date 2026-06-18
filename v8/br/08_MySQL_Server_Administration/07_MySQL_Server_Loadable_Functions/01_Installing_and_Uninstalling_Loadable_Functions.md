### 7.7.1 Instalação e Desinstalação de Funções Carregáveis

As funções carregáveis, como o nome sugere, devem ser carregadas no servidor antes de poderem ser usadas. O MySQL suporta o carregamento automático de funções durante a inicialização do servidor e o carregamento manual posteriormente.

Enquanto uma função carregável estiver sendo carregada, as informações sobre ela estarão disponíveis conforme descrito na Seção 7.7.2, “Obtendo Informações sobre Funções Carregáveis”.

- Instalando Funções Carregáveis
- Desinstalação de Funções Carregáveis
- Reinicialização ou Atualização de Funções Carregáveis

#### Instalando Funções Carregáveis

Para carregar uma função carregável manualmente, use a instrução `CREATE FUNCTION`. Por exemplo:

```
CREATE FUNCTION metaphon
  RETURNS STRING
  SONAME 'udf_example.so';
```

O nome de base do arquivo depende da sua plataforma. Sufixos comuns são `.so` para sistemas Unix e Unix-like, e `.dll` para sistemas Windows.

`CREATE FUNCTION` tem esses efeitos:

- Ele carrega a função no servidor para torná-la disponível imediatamente.

- Ele registra a função na tabela de sistema `mysql.func` para torná-la persistente após reinicializações do servidor. Por essa razão, `CREATE FUNCTION` requer o privilégio `INSERT` para o banco de dados do sistema `mysql`.

- Ele adiciona a função à tabela do Schema de Desempenho `user_defined_functions` que fornece informações de tempo de execução sobre as funções carregáveis instaladas. Veja a Seção 7.7.2, “Obtendo Informações Sobre Funções Carregáveis”.

O carregamento automático das funções carregáveis ocorre durante a sequência normal de inicialização do servidor:

- As funções registradas na tabela `mysql.func` estão instaladas.

- Componentes ou plugins instalados durante o início podem instalar automaticamente as funções relacionadas.

- A instalação automática de funções adiciona as funções à tabela do Schema de Desempenho `user_defined_functions` que fornece informações de execução sobre as funções instaladas.

Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela `mysql.func` não serão carregadas e ficarão indisponíveis. Isso não se aplica às funções instaladas automaticamente por um componente ou plugin.

#### Desinstalação de Funções Carregáveis

Para remover uma função carregável, use a instrução `DROP FUNCTION`. Por exemplo:

```
DROP FUNCTION metaphon;
```

`DROP FUNCTION` tem esses efeitos:

- Descarrega a função para torná-la indisponível.

- Ele remove a função da tabela de sistema `mysql.func`. Por essa razão, `DROP FUNCTION` requer o privilégio `DELETE` para o banco de dados de sistema `mysql`. Como a função não está mais registrada na tabela `mysql.func`, o servidor não carrega a função durante reinicializações subsequentes.

- Ele remove a função da tabela do Schema de Desempenho `user_defined_functions` que fornece informações de tempo de execução sobre as funções carregáveis instaladas.

`DROP FUNCTION` não pode ser usado para descartar uma função carregável que é instalada automaticamente por componentes ou plugins, em vez de usar `CREATE FUNCTION`. Tal função também é descartada automaticamente quando o componente ou plugin que a instalou é desinstalado.

#### Reinicialização ou Atualização de Funções Carregáveis

Para reinstalar ou atualizar a biblioteca compartilhada associada a uma função carregável, execute uma declaração `DROP FUNCTION`, atualize a biblioteca compartilhada e, em seguida, execute uma declaração `CREATE FUNCTION`. Se você atualizar a biblioteca compartilhada primeiro e, em seguida, usar `DROP FUNCTION`, o servidor pode ser desligado inesperadamente.
