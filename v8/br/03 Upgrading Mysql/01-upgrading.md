# Capítulo 3: Atualização do MySQL

A atualização é um procedimento comum, pois você recebe correções de bugs dentro da mesma série de lançamentos do MySQL ou recursos significativos entre os principais lançamentos do MySQL. Você realiza esse procedimento primeiro em alguns sistemas de teste para garantir que tudo funcione sem problemas e, em seguida, nos sistemas de produção.

::: info Nota

Na discussão a seguir, os comandos do MySQL que devem ser executados usando uma conta MySQL com privilégios administrativos incluem `-u root` na linha de comando para especificar o usuário `root` do MySQL. Os comandos que exigem uma senha para `root` também incluem a opção `-p`. Como `-p` é seguido por nenhum valor de opção, esses comandos solicitam a senha. Digite a senha quando solicitado e pressione Enter.

As instruções SQL podem ser executadas usando o cliente de linha de comando `mysql` (conecte-se como `root` para garantir que você tenha os privilégios necessários).