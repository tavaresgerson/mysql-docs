#### 6.5.1.3 Registro do Cliente `mysql`

O cliente `mysql` pode realizar esses tipos de registro para instruções executadas interativamente:

* No Unix, o `mysql` escreve as instruções em um arquivo de histórico. Por padrão, esse arquivo é chamado `.mysql_history` no seu diretório de casa. Para especificar um arquivo diferente, defina o valor da variável de ambiente `MYSQL_HISTFILE`.
* Em todas as plataformas, se a opção `--syslog` for fornecida, o `mysql` escreve as instruções na facilidade de registro do sistema. No Unix, isso é `syslog`; no Windows, é o Registro de Eventos do Windows. O destino onde as mensagens registradas aparecem depende do sistema. No Linux, o destino é frequentemente o arquivo `/var/log/messages`.

A discussão a seguir descreve características que se aplicam a todos os tipos de registro e fornece informações específicas para cada tipo de registro.

* Como o Registro Ocorre
* Controlar o Arquivo de Histórico
* Características do Registro `syslog`

##### Como o Registro Ocorre

Para cada destino de registro habilitado, o registro de instruções ocorre da seguinte forma:

* As instruções são registradas apenas quando executadas interativamente. As instruções são não interativas, por exemplo, quando lidas de um arquivo ou de uma pipe. Também é possível suprimir o registro de instruções usando a opção `--batch` ou `--execute`.
* As instruções são ignoradas e não registradas se corresponderem a qualquer padrão na lista de "ignorar". Essa lista é descrita mais adiante.
* O `mysql` registra cada linha de instrução não ignorada e não vazia individualmente.
* Se uma instrução não ignorada se estender por várias linhas (excluindo o delimitador final), o `mysql` concatena as linhas para formar a instrução completa, mapeia novas linhas para espaços e registra o resultado, além de um delimitador.

Consequentemente, uma instrução de entrada que se estende por várias linhas pode ser registrada duas vezes. Considere esta entrada:

```
mysql> SELECT
    -> 'Today is'
    -> ,
    -> CURDATE()
    -> ;
```uFeUGT3ME1```
SELECT
'Today is'
,
CURDATE()
;
SELECT 'Today is' , CURDATE();
```SCfyP65sXp```
mysql --histignore="*UPDATE*:*DELETE*"
```QN23DWayao```
  ln -s /dev/null $HOME/.mysql_history
  ```fNSb2oNfn1```