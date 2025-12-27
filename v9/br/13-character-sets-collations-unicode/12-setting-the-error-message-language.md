## 12.12 Definindo o Idioma da Mensagem de Erro

Por padrão, o **mysqld** gera mensagens de erro em inglês, mas elas podem ser exibidas em vez disso em qualquer um dos vários outros idiomas: checo, dinamarquês, holandês, estoniano, francês, alemão, grego, húngaro, italiano, japonês, coreano, norueguês, norueguês-ny, polonês, português, romeno, russo, eslovaco, espanhol ou sueco. Isso se aplica às mensagens que o servidor escreve no log de erro e envia aos clientes.

Para selecionar o idioma em que o servidor escreve as mensagens de erro, siga as instruções nesta seção. Para obter informações sobre a alteração do conjunto de caracteres para as mensagens de erro (em vez do idioma), consulte a Seção 12.6, “Conjunto de caracteres da Mensagem de Erro”. Para informações gerais sobre a configuração do registro de erros, consulte a Seção 7.4.2, “O Log de Erro”.

O servidor busca o arquivo de mensagem de erro usando estas regras:

* Ele procura o arquivo em um diretório construído a partir de dois valores de variáveis de sistema, `lc_messages_dir` e `lc_messages`, com este último convertido para um nome de idioma. Suponha que você inicie o servidor usando este comando:

  ```
  mysqld --lc_messages_dir=/usr/share/mysql --lc_messages=fr_FR
  ```

  Neste caso, o **mysqld** mapeia o local `fr_FR` para o idioma `french` e procura o arquivo de erro no diretório `/usr/share/mysql/french`.

  Por padrão, os arquivos de idioma estão localizados no diretório `share/mysql/LANGUAGE` sob o diretório base do MySQL.

* Se o arquivo de mensagem não for encontrado no diretório construído como descrito, o servidor ignora o valor `lc_messages` e usa apenas o valor `lc_messages_dir` como local para procurar.

* Se o servidor não conseguir encontrar o arquivo de mensagem configurado, ele escreve uma mensagem no log de erro para indicar o problema e usa mensagens em inglês padrão.

A variável de sistema `lc_messages_dir` pode ser definida apenas no início da inicialização do servidor e tem apenas um valor de leitura global durante a execução. `lc_messages` pode ser definido no início da inicialização do servidor e tem valores globais e de sessão que podem ser modificados durante a execução. Assim, a linguagem da mensagem de erro pode ser alterada enquanto o servidor estiver em execução, e cada cliente pode ter sua própria linguagem de mensagem de erro ao definir o valor de `lc_messages` da sessão para o nome do idioma desejado. Por exemplo, se o servidor estiver usando o `fr_FR` como idioma de erro para mensagens de erro, um cliente pode executar essa instrução para receber mensagens de erro em inglês:

```
SET lc_messages = 'en_US';
```