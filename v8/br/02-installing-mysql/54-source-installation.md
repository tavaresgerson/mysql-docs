## 2.8 Instalação do MySQL a partir do Source

Construir o MySQL a partir do código-fonte permite personalizar parâmetros de construção, otimizações do compilador e localização de instalação. Para uma lista de sistemas nos quais o MySQL é conhecido por rodar, consulte \[<https://www.mysql.com/support/supportedplatforms/database.html>] (<https://www.mysql.com/support/supportedplatforms/database.html>).

Antes de prosseguir com uma instalação a partir do código-fonte, verifique se a Oracle produz uma distribuição binária pré-compilada para sua plataforma e se ela funciona para você.

Se você estiver interessado em construir o MySQL a partir de uma distribuição de origem usando opções de compilação iguais ou semelhantes às usadas pela Oracle para produzir distribuições binárias em sua plataforma, obtenha uma distribuição binária, desempaquete-a e procure no arquivo `docs/INFO_BIN`, que contém informações sobre como essa distribuição MySQL foi configurada e compilada.

Advertência

A construção do MySQL com opções não padrão pode levar a uma redução de funcionalidade, desempenho ou segurança.

O código fonte do MySQL contém documentação interna escrita usando o Doxygen. O conteúdo do Doxygen gerado está disponível em \[<https://dev.mysql.com/doc/index-other.html>]<https://dev.mysql.com/doc/index-other.html>] Também é possível gerar esse conteúdo localmente a partir de uma distribuição de fonte do MySQL usando as instruções na Seção 2.8.10, Generating MySQL Doxygen Documentation Content.
