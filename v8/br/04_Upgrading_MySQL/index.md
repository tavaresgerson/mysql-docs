# Capítulo 3: Atualizando o MySQL

Este capítulo descreve os passos para atualizar uma instalação do MySQL.

A atualização é um procedimento comum, pois você obtém correções de bugs na mesma série de lançamento do MySQL ou recursos significativos entre os lançamentos principais do MySQL. Você realiza esse procedimento primeiro em alguns sistemas de teste para garantir que tudo funcione sem problemas e, em seguida, nos sistemas de produção.

Nota

Na discussão a seguir, os comandos do MySQL que devem ser executados usando uma conta do MySQL com privilégios administrativos incluem `-u root` na linha de comando para especificar o usuário do MySQL `root`. Os comandos que exigem uma senha para `root` também incluem uma opção `-p`. Como `-p` não é seguido por nenhum valor de opção, esses comandos solicitam a senha. Digite a senha quando solicitado e pressione Enter.

As instruções SQL podem ser executadas usando o cliente de linha de comando **mysql** (conecte-se como `root` para garantir que você tenha os privilégios necessários).