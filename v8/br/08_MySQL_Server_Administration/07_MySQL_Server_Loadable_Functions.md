## 7.7 Funções carregáveis do MySQL Server

O MySQL suporta funções carregáveis, ou seja, funções que não são construídas internamente, mas podem ser carregadas em tempo de execução (durante o início ou posteriormente) para ampliar as capacidades do servidor, ou descarregadas para remover capacidades. Para uma tabela que descreve as funções carregáveis disponíveis, consulte a Seção 14.2, “Referência de Função Carregável”. As funções carregáveis contrastam com as funções integrais (nativas), que são implementadas como parte do servidor e estão sempre disponíveis; para uma tabela, consulte a Seção 14.1, “Referência de Função e Operador Integrado”.

Nota

As funções carregáveis eram anteriormente conhecidas como funções definidas pelo usuário (UDFs). Essa terminologia era um pouco equivocada, pois "definida pelo usuário" também pode se aplicar a outros tipos de funções, como funções armazenadas (um tipo de objeto armazenado escrito usando SQL) e funções nativas adicionadas modificando o código-fonte do servidor.

As distribuições do MySQL incluem funções carregáveis que implementam, total ou parcialmente, essas capacidades do servidor:

* A Replicação em Grupo permite que você crie um serviço MySQL altamente disponível distribuído em um grupo de instâncias do servidor MySQL, com consistência de dados, detecção e resolução de conflitos e serviços de participação em grupo, tudo integrado. Veja o Capítulo 20, *Replicação em Grupo*.

* A Edição Empresarial do MySQL inclui funções que realizam operações de criptografia com base na biblioteca OpenSSL. Veja a Seção 8.6, “Criptografia Empresarial do MySQL”.

* A Edição Empresarial do MySQL inclui funções que oferecem uma API de nível SQL para operações de mascaramento e desidentificação. Consulte os elementos de mascaramento e desidentificação de dados do MySQL Empresarial.

* A Edição Empresarial do MySQL inclui registro de auditoria para monitoramento e registro de atividade de conexão e consulta. Consulte a Seção 8.4.5, “Auditoria do MySQL Empresarial”, e a Seção 8.4.6, “O Componente da Mensagem de Auditoria”.

* A Edição Empresarial do MySQL inclui uma capacidade de firewall que implementa um firewall de nível de aplicação para permitir que os administradores de banco de dados permitam ou negam a execução de declarações SQL com base na correspondência com padrões para declarações aceitas. Veja a Seção 8.4.7, “Firewall Empresarial do MySQL”.

* Um reescritor de consulta examina as declarações recebidas pelo MySQL Server e, possivelmente, as reescreve antes de o servidor executá-las. Veja a Seção 7.6.4, “O Plugin de Reescrita de Consulta do Rewriter”

* Tokens de versão permite a criação e sincronização em torno de tokens do servidor que as aplicações podem usar para evitar o acesso a dados incorretos ou desatualizados. Veja a Seção 7.6.6, “Tokens de versão”.

* O Keyring do MySQL oferece armazenamento seguro para informações sensíveis. Veja a Seção 8.4.4, “O Keyring do MySQL”.

* Um serviço de bloqueio oferece uma interface de bloqueio para uso de aplicativos. Veja a Seção 7.6.9.1, “O Serviço de Bloqueio”.

* Uma função fornece acesso a atributos de consulta. Veja a Seção 11.6, “Atributos de consulta”.

As seções a seguir descrevem como instalar e desinstalar funções carregáveis e como determinar em tempo de execução quais funções carregáveis estão instaladas e obter informações sobre elas.

Em alguns casos, uma função carregável é carregada instalando o componente que implementa a função, em vez de carregar a função diretamente. Para obter detalhes sobre uma função carregável específica, consulte as instruções de instalação do recurso do servidor que a inclui.

Para obter informações sobre como escrever funções carregáveis, consulte Adicionar funções ao MySQL.

### 7.7.1 Instalar e desinstalar funções carregáveis

As funções carregáveis, como o nome sugere, devem ser carregadas no servidor antes de serem utilizadas. O MySQL suporta o carregamento automático de funções durante a inicialização do servidor e o carregamento manual posteriormente.

Enquanto uma função carregável é carregada, as informações sobre ela estão disponíveis conforme descrito na Seção 7.7.2, “Obtenção de informações sobre funções carregáveis”.

* Instalar funções carregáveis
* Desinstalar funções carregáveis
* Reinstalar ou atualizar funções carregáveis

#### Instalação de Funções Carregáveis

Para carregar uma função carregável manualmente, use a declaração `CREATE FUNCTION`(create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). Por exemplo:

```
CREATE FUNCTION metaphon
  RETURNS STRING
  SONAME 'udf_example.so';
```

O nome de base do arquivo depende da sua plataforma. Sufixos comuns são `.so` para Unix e sistemas semelhantes ao Unix, `.dll` para Windows.

`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") tem esses efeitos:

* Carrega a função no servidor para torná-la disponível imediatamente.

* Registra a função na tabela de sistema `mysql.func` para torná-la persistente após reinicializações do servidor. Por essa razão, `CREATE FUNCTION`(create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") requer o privilégio `INSERT` para o banco de dados do sistema `mysql`.

* Adiciona a função à tabela do Schema de desempenho `user_defined_functions` que fornece informações de tempo de execução sobre as funções carregáveis instaladas. Veja a Seção 7.7.2, “Obtenção de informações sobre funções carregáveis”.

O carregamento automático das funções carregáveis ocorre durante a sequência normal de inicialização do servidor:

* Funções registradas na tabela `mysql.func` são instaladas.

* Os componentes ou plugins que são instalados no início podem instalar automaticamente as funções relacionadas.

* A instalação automática das funções adiciona as funções à tabela do Schema de desempenho `user_defined_functions` que fornece informações de tempo de execução sobre as funções instaladas.

Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela `mysql.func` não são carregadas e ficam indisponíveis. Isso não se aplica às funções instaladas automaticamente por um componente ou plugin.

#### Desinstalando funções carregáveis

Para remover uma função carregável, use a declaração `DROP FUNCTION`(drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions"). Por exemplo:

```
DROP FUNCTION metaphon;
```

`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") tem esses efeitos:

* Descarrega a função para torná-la indisponível.
* Remove a função da tabela do sistema `mysql.func`. Por esse motivo, (drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") `DROP FUNCTION` requer o privilégio `DELETE` para o banco de dados do sistema `mysql`. Com a função não registrada mais na tabela `mysql.func`, o servidor não carrega a função durante os reinício subsequentes.

* Remove a função da tabela do Schema de desempenho `user_defined_functions` que fornece informações de tempo de execução sobre as funções carregáveis instaladas.

`DROP FUNCTION` (drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") não pode ser usado para descartar uma função carregável que é instalada automaticamente por componentes ou plugins, em vez de usar `CREATE FUNCTION` (create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). Tal função também é descartada automaticamente, quando o componente ou plugin que a instalou é desinstalado.

#### Reinstalação ou Atualização de Funções Carregáveis

Para reinstalar ou atualizar a biblioteca compartilhada associada a uma função carregável, emita uma declaração `DROP FUNCTION` (drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions"), atualize a biblioteca compartilhada e, em seguida, emita uma declaração `CREATE FUNCTION` (create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). Se atualizar a biblioteca compartilhada primeiro e, em seguida, usar `DROP FUNCTION` (drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions"), o servidor pode ser desligado inesperadamente.

### 7.7.2 Obter informações sobre funções carregáveis

A tabela Schema de desempenho `user_defined_functions` contém informações sobre as funções carregáveis atualmente instaladas:

```
SELECT * FROM performance_schema.user_defined_functions;
```

A tabela do sistema `mysql.func` também lista as funções carregáveis instaladas, mas apenas aquelas instaladas usando [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). A tabela `user_defined_functions` lista as funções carregáveis instaladas usando [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") e também as funções carregáveis instaladas automaticamente por componentes ou plugins. Essa diferença torna `user_defined_functions` preferível a `mysql.func` para verificar quais funções carregáveis estão instaladas. Veja a Seção 29.12.21.10, “A tabela user_defined_functions”.