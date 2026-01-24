## 10.12 Configurando o Idioma das Mensagens de Erro

Por padrão, o **mysqld** produz mensagens de erro em inglês, mas elas podem ser exibidas em qualquer um destes outros idiomas: Tcheco, Dinamarquês, Holandês, Estoniano, Francês, Alemão, Grego, Húngaro, Italiano, Japonês, Coreano, Norueguês, Norwegian-ny, Polonês, Português, Romeno, Russo, Eslovaco, Espanhol ou Sueco. Isso se aplica às mensagens que o servidor grava no *error log* e envia aos *clients*.

Para selecionar o idioma no qual o servidor grava as mensagens de erro, siga as instruções nesta seção. Para obter informações sobre como alterar o *character set* para mensagens de erro (em vez do idioma), consulte a Seção 10.6, “Error Message Character Set”. Para informações gerais sobre a configuração do registro de erros, consulte a Seção 5.4.2, “O Error Log”.

O servidor busca o arquivo de mensagens de erro usando estas regras:

* Ele procura o arquivo em um diretório construído a partir de dois valores de *system variable*, `lc_messages_dir` e `lc_messages`, com o último convertido para um nome de idioma. Suponha que você inicie o servidor usando este comando:

  ```sql
  mysqld --lc_messages_dir=/usr/share/mysql --lc_messages=fr_FR
  ```

  Neste caso, o **mysqld** mapeia o *locale* `fr_FR` para o idioma *french* e procura o arquivo de erro no diretório `/usr/share/mysql/french`.

  Por padrão, os arquivos de idioma estão localizados no diretório `share/mysql/LANGUAGE` sob o diretório base do MySQL.

* Se o arquivo de mensagem não puder ser encontrado no diretório construído conforme descrito, o servidor ignora o valor de `lc_messages` e usa apenas o valor de `lc_messages_dir` como o local onde procurar.

A *system variable* `lc_messages_dir` pode ser configurada apenas na inicialização do servidor e possui apenas um valor global de somente leitura em *runtime*. `lc_messages` pode ser configurada na inicialização do servidor e possui valores globais e de *session* que podem ser modificados em *runtime*. Assim, o idioma da mensagem de erro pode ser alterado enquanto o servidor está em execução, e cada *client* pode ter seu próprio idioma de mensagem de erro definindo o valor de sua *session* `lc_messages` para o nome de *locale* desejado. Por exemplo, se o servidor estiver usando o *locale* `fr_FR` para mensagens de erro, um *client* pode executar esta instrução para receber mensagens de erro em inglês:

```sql
SET lc_messages = 'en_US';
```