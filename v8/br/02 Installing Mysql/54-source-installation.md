## 2.8 Instalando o MySQL a partir do código-fonte

Construir o MySQL a partir do código-fonte permite que você personalize os parâmetros de compilação, otimizações do compilador e localização da instalação. Para uma lista dos sistemas nos quais o MySQL é conhecido por funcionar, consulte <https://www.mysql.com/support/supportedplatforms/database.html>.

Antes de prosseguir com uma instalação a partir do código-fonte, verifique se a Oracle produz uma distribuição binária pré-compilada para sua plataforma e se ela funciona para você. Colocamos muito esforço em garantir que nossos binários sejam construídos com as melhores opções possíveis para um desempenho ótimo. As instruções para instalar distribuições binárias estão disponíveis na Seção 2.2, “Instalando o MySQL no Unix/Linux Usando Binários Genéricos”.

Se você estiver interessado em construir o MySQL a partir de uma distribuição de código-fonte usando opções de compilação iguais ou semelhantes às usadas pela Oracle para produzir distribuições binárias em sua plataforma, obtenha uma distribuição binária, descompacte-a e procure no arquivo `docs/INFO_BIN`, que contém informações sobre como essa distribuição do MySQL foi configurada e compilada.

Aviso

Construir o MySQL com opções não padrão pode levar a uma redução da funcionalidade, desempenho ou segurança.

O código-fonte do MySQL contém documentação interna escrita usando Doxygen. O conteúdo gerado pelo Doxygen está disponível em https://dev.mysql.com/doc/index-other.html. Também é possível gerar esse conteúdo localmente a partir de uma distribuição de código-fonte do MySQL usando as instruções na Seção 2.8.10, “Gerando Conteúdo de Documentação Doxygen do MySQL”.