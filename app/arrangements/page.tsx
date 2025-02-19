'use client';
import {ListItemCard} from "@/app/components/ListItemCard";

export default function ArrangementsPage() {
    return (
        <div className={'flex flex-col justify-center items-center auto-rows-fr gap-4 md:gap-8 p-4 md:p-16'}>
            <ListItemCard
                name={'Hilton Chicago/Oak Brook Hills Resort & Conference Center'}
                notes={'This is where the wedding and reception is happening! We have a wedding block here.  We recommend booking your room ASAP as we have a limited number of rooms within our block!'}
                tags={['Wedding Venue']}
                linkUrl={'https://www.hilton.com/en/attend-my-event/chibhhh-rikawb-6b271841-f399-4c67-831d-3ec302eda97/'}
                imageUrl={'https://www.hilton.com/im/en/CHIBHHH/14500717/chibhhh-pool-1.jpg?impolicy=crop&cw=4752&ch=2661&gravity=NorthWest&xposition=123&yposition=0&rw=768&rh=430'}
            />
            <ListItemCard
                name={'Sleep Inn Oakbrook Terrace'}
                imageUrl={'https://www.choicehotels.com/hotelmedia/US/IL/oakbrook-terrace/IL607/1280/IL607Exterior02Temp_1.webp'}
                linkUrl={'https://www.choicehotels.com/illinois/oakbrook-terrace/sleep-inn-hotels/il607?iata=00232480&mc=mttatbrvnbn&meta=IL607_2025-10-11_TABAba_1_2_HotelWebsite&pmf=tripbl&refid=13228750-ef6e-444d-b70a-4791834824a8&adults=2&checkInDate=2025-10-11&checkOutDate=2025-10-12'}
                notes={'We don\'t have a block here, but it is an extra option in the area!'}
            />
            <ListItemCard
                name={'Staybridge Suites Chicago Oakbrook Terrace'}
                imageUrl={'https://digital.ihg.com/is/image/ihg/staybridge-suites-oakbrook-terrace-3709671694-3x2?wid=733'}
                linkUrl={'https://www.ihg.com/staybridge/hotels/us/en/oakbrook-terrace/chiot/hoteldetail'}
                notes={'We don\'t have a block here, but it is an extra option in the area!'}
            />
        </div>
    )
}