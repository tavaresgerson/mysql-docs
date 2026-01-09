#### 7.5.8.1 Tabelas de Rastreamento de Opções

O Rastreador de Opções fornece informações sobre as opções na forma de duas tabelas, listadas aqui:

* `performance_schema.mysql_option`: Para cada opção implementada por um componente ou plugin instalado no sistema, esta tabela do Schema de Desempenho mostra o nome da opção, o nome ou o componente ou plugin que fornece o recurso associado e se esse recurso está atualmente habilitado. Esta tabela é instalada executando `INSTALL COMPONENT 'file://component_option_tracker'`.

  Esta tabela, como outras tabelas do Schema de Desempenho, é de leitura somente e, portanto, não pode ser atualizada ou truncada por usuários.

  Veja a Seção 29.12.22.7, “A Tabela mysql_option”, para obter informações mais detalhadas sobre esta tabela, como colunas e seus possíveis valores.

* `mysql_option.option_usage`: Mostra, para cada opção instalada, o nome do recurso associado, dados de uso do recurso no formato `JSON` e outras informações. Esta tabela é instalada executando o script SQL `option_tracker_install.sql`, e desinstalada executando `option_tracker_uninstall.sql`, ambos encontrados no diretório `share` do MySQL.

  Esta tabela deve ser considerada de leitura somente. Ler `mysql_option.option_usage` requer o privilégio `OPTION_TRACKER_UPDATER` ou o privilégio `OPTION_TRACKER_OBSERVER`.

  Embora seja possível escrever nesta tabela, *recomendamos fortemente que você não tente fazer isso*.

  Mais informações detalhadas sobre esta tabela são fornecidas mais adiante nesta seção.

Importante

`INSTALE O COMPONENTENTE 'file://component_option_tracker'` instala a biblioteca de componentes e a tabela `mysql_option` do Schema de Desempenho, mas *não* instala a tabela `mysql_option.option_usage`, que requer a execução do script de instalação SQL encontrado no diretório `share` do MySQL Server, conforme descrito nos próximos parágrafos.

Para realizar uma instalação completa do componente Option Tracker, execute o script de instalação a partir do shell do sistema da seguinte forma:

```
$> mysql -uusername -ppassword < path/to/option_tracker_install.sql
```

(Você pode precisar usar opções adicionais, como `-h`, para o cliente **mysql** ao executar o script de instalação dessa maneira, dependendo das circunstâncias.)

Alternativamente, você pode executar o script dentro de uma sessão do cliente MySQL usando o comando `source` ou `\.`, como mostrado aqui:

```
mysql> source path/to/option_tracker_install.sql

mysql> \. path/to/option_tracker_install.sql
```

O caminho é relativo ao diretório em que o cliente **mysql** é executado.

Para mais informações, consulte a Seção 6.5.1.5, “Executando Instruções SQL a partir de um Arquivo de Texto”.

A tabela `mysql_option.option_usage` fornece informações de uso sobre as opções disponíveis no MySQL Server, componentes e plugins:

```
mysql> TABLE mysql_option.option_usage\G
*************************** 1. row ***************************
 CLUSTER_ID:
  SERVER_ID:
OPTION_NAME: JavaScript Library
 USAGE_DATA: {"usedCounter": "2", "usedDate": "2025-03-11T17:08:31Z"}
*************************** 2. row ***************************
 CLUSTER_ID:
  SERVER_ID:
OPTION_NAME: JavaScript Stored Program
 USAGE_DATA: {"usedCounter": "5", "usedDate": "2025-03-11T17:08:31Z"}
```

A tabela `option_usage` tem as seguintes colunas:

* `CLUSTER_ID`

  O UUID do cluster de Replicação de Grupo MySQL do qual este servidor faz parte. Atualmente, permanece vazio.

* `SERVER_ID`

  O UUID do servidor se ele faz parte de um cluster de Replicação de Grupo MySQL. Atualmente, permanece vazio.

* `OPTION_NAME`

  O nome único do recurso.

* `USAGE_DATA`

  Dados de uso da opção no formato de objeto `JSON`. Esses dados usam 2 chaves, listadas aqui:

  + `usedCounter`: Um inteiro indicando o número de vezes que o recurso foi usado.

  + `usedDate`: Uma data e hora UTC indicando quando o recurso foi usado pela última vez.

Essas informações persistem entre os reinicializações do servidor e podem estar presentes mesmo que a opção correspondente não esteja atualmente habilitada (ou mesmo se não estiver instalada).

Esta tabela tem uma chave primária nas colunas `CLUSTER_ID`, `SERVER_ID` e `OPTION_NAME`. O valor da coluna `OPTION_NAME` nesta tabela para uma opção específica é o mesmo que o valor da coluna `OPTION_NAME` para a mesma funcionalidade na tabela `performance_schema.mysql_option`. Assim, você pode realizar uma junção entre as duas tabelas de uma maneira semelhante à mostrada aqui:

```
mysql> SELECT * FROM performance_schema.mysql_option o
    -> JOIN mysql_option.option_usage u
    -> ON o.OPTION_NAME=u.OPTION_NAME\G
*************************** 1. row ***************************
     OPTION_NAME: JavaScript Library
  OPTION_ENABLED: TRUE
OPTION_CONTAINER: component:mle
      CLUSTER_ID:
       SERVER_ID:
     OPTION_NAME: JavaScript Library
      USAGE_DATA: {"used": false, "usedDate": "2025-01-13T17:08:31Z"}
*************************** 2. row ***************************
     OPTION_NAME: JavaScript Stored Program
  OPTION_ENABLED: TRUE
OPTION_CONTAINER: component:mle
      CLUSTER_ID:
       SERVER_ID:
     OPTION_NAME: JavaScript Stored Program
      USAGE_DATA: {"used": false, "usedDate": "2025-01-13T17:08:31Z"}
```

Ao contrário da tabela `mysql_option` do Schema de Desempenho, a tabela `option_usage` é gravável e pode ser atualizada usando instruções SQL.

Na Replicação em Grupo, os dados de uso de opções são gerados no primário. Eles não são escritos no log binário nem replicados, mas são propagados para os secundários usando o protocolo de Replicação em Grupo. As réplicas individuais podem escrever seus próprios dados de uso de opções nesta tabela. Isso inclui nós de leitura/escrita em clusters de Replicação em Grupo; nós de leitura apenas não podem escrever nesta tabela.

As contas de usuário devem ter os privilégios necessários para acessar esta tabela.