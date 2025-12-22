# Capítulo 3 Atualização do MySQL

A atualização é um procedimento comum, como você pega correções de bugs dentro da mesma série de lançamentos do MySQL ou recursos significativos entre as principais versões do MySQL. Você executa este procedimento primeiro em alguns sistemas de teste para garantir que tudo funcione sem problemas, e depois nos sistemas de produção.

::: info Note

Na discussão a seguir, os comandos MySQL que devem ser executados usando uma conta MySQL com privilégios administrativos incluem `-u root` na linha de comando para especificar o usuário MySQL `root`. Os comandos que exigem uma senha para `root` também incluem uma opção `-p`.

As instruções SQL podem ser executadas usando o cliente de linha de comando `mysql` (conecte-se como `root` para garantir que você tenha os privilégios necessários).

:::
