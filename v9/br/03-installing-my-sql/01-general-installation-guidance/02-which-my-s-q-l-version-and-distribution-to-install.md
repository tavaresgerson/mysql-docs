### 2.1.2 Qual versão e distribuição do MySQL para instalar

Ao preparar-se para instalar o MySQL, decida qual versão e formato de distribuição (binário ou fonte) usar.

Primeiro, decida se vai instalar a partir de uma série LTS, como o MySQL 8.4, ou instalar a partir de uma série de inovação, como o MySQL 9.5. Ambas as faixas incluem correções de bugs, enquanto as versões de inovação incluem as últimas novas funcionalidades e mudanças. Para detalhes adicionais, consulte a Seção 1.3, “Versões do MySQL: Inovação e LTS”.

O esquema de nomeação no MySQL 9.5 usa nomes de versão que consistem em três números e um sufixo opcional (por exemplo, **mysql-9.0.0**). Os números dentro do nome da versão são interpretados da seguinte forma:

* O primeiro número (**9**) é o número da versão principal.

* O segundo número (**0**) é o número da versão secundária. O número da versão secundária não muda para uma série LTS, mas muda para uma série de inovação.

* O terceiro número (**0**) é o número da versão dentro de uma série. Esse número é incrementado para cada nova versão LTS, mas provavelmente sempre é 0 para versões de inovação.

Após escolher qual versão do MySQL instalar, decida qual formato de distribuição instalar para o seu sistema operacional. Para a maioria dos casos de uso, uma distribuição binária é a escolha certa. Distribuições binárias estão disponíveis no formato nativo para muitas plataformas, como pacotes RPM para Linux ou pacotes DMG para macOS. Distribuições também estão disponíveis em formatos mais genéricos, como arquivos Zip ou arquivos **tar** comprimidos. No Windows, você pode usar um MSI para instalar uma distribuição binária.

Em algumas circunstâncias, pode ser preferível instalar o MySQL a partir de uma distribuição de fonte:

* Você deseja instalar o MySQL em um local específico. As distribuições binárias padrão estão prontas para serem executadas em qualquer local de instalação, mas você pode precisar de mais flexibilidade para colocar os componentes do MySQL onde desejar.

* Você deseja configurar o **mysqld** com recursos que podem não estar incluídos nas distribuições binárias padrão. Aqui está uma lista das opções extras mais comuns usadas para garantir a disponibilidade dos recursos:

  + `-DWITH_LIBWRAP=1` para suporte a wrappers TCP.

  + `-DWITH_ZLIB={system|bundled}` para recursos que dependem da compressão

  + `-DWITH_DEBUG=1` para suporte de depuração

Para obter informações adicionais, consulte a Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”.

* Você deseja configurar o **mysqld** sem alguns recursos que estão incluídos nas distribuições binárias padrão.

* Você deseja ler ou modificar o código C e C++ que compõe o MySQL. Para isso, obtenha uma distribuição de código-fonte.

* As distribuições de código-fonte contêm mais testes e exemplos do que as distribuições binárias.