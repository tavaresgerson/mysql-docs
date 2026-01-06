## 10.12 Definindo o idioma da mensagem de erro

Por padrão, o **mysqld** gera mensagens de erro em inglês, mas elas podem ser exibidas em vez disso em qualquer uma das várias outras línguas: checo, dinamarquês, holandês, estoniano, francês, alemão, grego, húngaro, italiano, japonês, coreano, norueguês, norueguês-ny, polonês, português, romeno, russo, eslovaco, espanhol ou sueco. Isso se aplica às mensagens que o servidor escreve no log de erro e envia aos clientes.

Para selecionar o idioma no qual o servidor escreve as mensagens de erro, siga as instruções nesta seção. Para obter informações sobre a alteração do conjunto de caracteres para as mensagens de erro (em vez do idioma), consulte a Seção 10.6, “Conjunto de caracteres de mensagens de erro”. Para informações gerais sobre a configuração do registro de erros, consulte a Seção 5.4.2, “O Log de Erros”.

O servidor procura o arquivo de mensagem de erro usando essas regras:

- Ele procura pelo arquivo em um diretório construído a partir de dois valores de variáveis do sistema, `lc_messages_dir` e `lc_messages`, com este último convertido para um nome de idioma. Suponha que você inicie o servidor usando este comando:

  ```sql
  mysqld --lc_messages_dir=/usr/share/mysql --lc_messages=fr_FR
  ```

  Neste caso, o **mysqld** mapeia o local `fr_FR` para o idioma `french` e procura o arquivo de erro no diretório `/usr/share/mysql/french`.

  Por padrão, os arquivos de idioma estão localizados no diretório `share/mysql/LANGUAGE` sob o diretório de base do MySQL.

- Se o arquivo de mensagens não for encontrado no diretório descrito acima, o servidor ignora o valor `lc_messages` e usa apenas o valor `lc_messages_dir` como local para procurar.

A variável de sistema `lc_messages_dir` pode ser definida apenas no início do servidor e tem apenas um valor de leitura global durante a execução. `lc_messages` pode ser definido no início do servidor e tem valores globais e de sessão que podem ser modificados durante a execução. Assim, a linguagem da mensagem de erro pode ser alterada enquanto o servidor estiver em execução, e cada cliente pode ter sua própria linguagem de mensagem de erro definindo o valor de `lc_messages` da sessão para o nome do idioma desejado. Por exemplo, se o servidor estiver usando o `fr_FR` como idioma de mensagens de erro, um cliente pode executar essa instrução para receber mensagens de erro em inglês:

```sql
SET lc_messages = 'en_US';
```
