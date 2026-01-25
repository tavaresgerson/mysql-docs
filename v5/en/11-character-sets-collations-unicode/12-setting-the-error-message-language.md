## 10.12 Configurando o Idioma da Mensagem de Erro

Por padrão, o **mysqld** produz mensagens de erro em inglês, mas elas podem ser exibidas em vários outros idiomas: tcheco, dinamarquês, holandês, estoniano, francês, alemão, grego, húngaro, italiano, japonês, coreano, norueguês, norueguês-ny, polonês, português, romeno, russo, eslovaco, espanhol ou sueco. Isso se aplica às mensagens que o *server* escreve no *error log* e envia aos *clients*.

Para selecionar o idioma no qual o *server* escreve as mensagens de erro, siga as instruções nesta seção. Para obter informações sobre como alterar o *character set* das mensagens de erro (em vez do idioma), consulte a Seção 10.6, “*Error Message Character Set*”. Para obter informações gerais sobre como configurar o *error logging*, consulte a Seção 5.4.2, “The Error Log”.

O *server* procura pelo arquivo de mensagem de erro usando estas regras:

* Ele procura pelo arquivo em um diretório construído a partir de dois valores de *system variable*: `lc_messages_dir` e `lc_messages`, sendo este último convertido em um nome de idioma. Suponha que você inicie o *server* usando este comando:

  ```sql
  mysqld --lc_messages_dir=/usr/share/mysql --lc_messages=fr_FR
  ```

  Neste caso, o **mysqld** mapeia o *locale* `fr_FR` para o idioma `french` e procura pelo arquivo de erro no diretório `/usr/share/mysql/french`.

  Por padrão, os arquivos de idioma estão localizados no diretório `share/mysql/LANGUAGE`, dentro do *base directory* do MySQL.

* Se o arquivo de mensagem não puder ser encontrado no diretório construído conforme descrito, o *server* ignora o valor de `lc_messages` e usa apenas o valor de `lc_messages_dir` como o local para procurar.

A *system variable* `lc_messages_dir` pode ser definida apenas durante o *server startup* e tem apenas um valor *global read-only* em *runtime*. `lc_messages` pode ser definida durante o *server startup* e possui valores *global* e de *session* que podem ser modificados em *runtime*. Assim, o idioma da mensagem de erro pode ser alterado enquanto o *server* está em execução, e cada *client* pode ter seu próprio idioma de mensagem de erro definindo o valor de *session* de `lc_messages` para o nome de *locale* desejado. Por exemplo, se o *server* estiver usando o *locale* `fr_FR` para mensagens de erro, um *client* pode executar esta *statement* para receber mensagens de erro em inglês:

```sql
SET lc_messages = 'en_US';
```
