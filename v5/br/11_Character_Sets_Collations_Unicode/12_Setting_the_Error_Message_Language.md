## 10.12 Definindo o idioma do Mensagem de Erro

Por padrão, `mysqld` produzirá mensagens de erro em inglês, mas elas podem ser exibidas em vez disso em qualquer uma das várias outras línguas: checo, dinamarquês, holandês, estoniano, francês, alemão, grego, húngaro, italiano, japonês, coreano, norueguês, norueguês-ny, polonês, português, romeno, russo, eslovaco, espanhol ou sueco. Isso se aplica às mensagens que o servidor escreve no log de erro e envia para os clientes.

Para selecionar o idioma no qual o servidor escreve as mensagens de erro, siga as instruções nesta seção. Para informações sobre a alteração do conjunto de caracteres para mensagens de erro (em vez do idioma), consulte a Seção 10.6, “Conjunto de caracteres do registro de erro”. Para informações gerais sobre a configuração do registro de erros, consulte a Seção 5.4.2, “O registro de erro”.

O servidor procura o arquivo de mensagem de erro usando essas regras:

* Procura o arquivo em um diretório construído a partir de dois valores de variáveis do sistema, `lc_messages_dir` e `lc_messages`, com este último convertido em um nome de idioma. Suponha que você inicie o servidor usando este comando:

  ```sql
  mysqld --lc_messages_dir=/usr/share/mysql --lc_messages=fr_FR
  ```

Neste caso, `mysqld` mapeia o local `fr_FR` para a língua `french` e procura o arquivo de erro no diretório `/usr/share/mysql/french`.

Por padrão, os arquivos de idioma estão localizados no diretório `share/mysql/LANGUAGE` sob o diretório de base do MySQL.

* Se o arquivo de mensagem não for encontrado no diretório construído como descrito acima, o servidor ignora o valor `lc_messages` e usa apenas o valor `lc_messages_dir` como a localização para procurar.

A variável de sistema `lc_messages_dir` pode ser definida apenas na inicialização do servidor e possui apenas um valor global de leitura somente no tempo de execução. `lc_messages` pode ser definido na inicialização do servidor e possui valores globais e de sessão que podem ser modificados no tempo de execução. Assim, o idioma da mensagem de erro pode ser alterado enquanto o servidor está em execução, e cada cliente pode ter seu próprio idioma de mensagem de erro, definindo seu valor de sessão `lc_messages` para o nome do idioma desejado. Por exemplo, se o servidor estiver usando o idioma `fr_FR` para mensagens de erro, um cliente pode executar esta declaração para receber mensagens de erro em inglês:

```sql
SET lc_messages = 'en_US';
```